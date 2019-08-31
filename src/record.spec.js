o.spec('Record', ()=>{
	'use strict'
	o.spec('.create', ()=>{
		o('()', ()=>{
			const record = Record.create()
			o(record.constructor).equals(Record)
			o(record.getCollection()).equals(undefined)
			o(record.getData()).deepEquals(undefined)
		})
		o('(@number)', ()=>{
			const input = 3
			const record = Record.create(input)
			o(record.getData()).equals(input)
		})
		o('(@string)', ()=>{
			const input = 'ayy'
			const record = Record.create(input)
			o(record.getData()).equals(input)
		})
		o('(@record)', ()=>{
			const firstRecord = Record.create({foo: 'bar'})
			const secondRecord = Record.create(firstRecord)
			o(secondRecord.getData()).equals(firstRecord.getData())
		})
		o('(@array)', ()=>{
			const input = []
			const returnValue = Record.create(input)
			o(returnValue.constructor).equals(Array)
			o(returnValue.length).equals(input.length)
		})
		o('(@array[@collection])', ()=>{
			const firstCollectionData = [1, 2, 3]
			const firstCollection = Collection.create(firstCollectionData)

			const secondCollectionData = [4, 5, 6]
			const secondCollection = Collection.create(secondCollectionData)

			const returnValue = Record.create([firstCollection, secondCollection])
			const expectedNumberOfRecords = (firstCollectionData.length + secondCollectionData.length).times(()=>Record)
			o(returnValue.constructor).equals(Array)
			o(returnValue.map(r=>r.constructor)).deepEquals(expectedNumberOfRecords)
			o(returnValue.map(r=>r.getData())).deepEquals(firstCollectionData.concat(secondCollectionData))
		})
		o('(@object)', ()=>{
			const input = {}
			const record = Record.create(input)
			o(record.getData()).equals(input)
		})
		o('(@object{data})', ()=>{
			const input = {foo: 'bar'}
			const record = Record.create(input)
			o(record.getData()).equals(input)
		})
		o('(@collection)', ()=>{
			const collectionData = [1, 2, 3]
			const collection = Collection.create(collectionData)
			const returnValue = Record.create(collection)
			o(returnValue.constructor).equals(Array)
			o(returnValue.map(r=>r.getData())).deepEquals(collectionData)
		})
	})
	o.spec('@record', ()=>{
		let record
		o.beforeEach(()=>{
			record = Record.create()
		})
		o.spec('.getFields', ()=>{
			let collection
			o.beforeEach(()=>{
				collection = Collection.create()
				collection.addRecord(record)
				collection.setFieldNames(['foo', 'bar'])
			})
			o.spec('()', ()=>{
				o('when has collection', ()=>{
					record.setData({foo: 'fizz'})
					o(record.getFields()).deepEquals(['fizz', undefined])
	
					record.setData({foo: undefined})
					o(record.getFields()).deepEquals([undefined, undefined])
	
					record.setData({foo: 'fizz', unusedField: 'aaa'})
					o(record.getFields()).deepEquals(['fizz', undefined])
				})
				o('when has no collection', ()=>{
					record.setData({foo: 'fizz'})
					record.setCollection()
					o(record.getFields()).deepEquals([])
				})
			})
			o('(@currentCollection)', ()=>{
				record.setData({foo: 'fizz'})
				o(record.getFields(record.getCollection())).deepEquals(record.getFields())
			})
			o('(@otherCollection)', ()=>{
				record.setData({foo: 'fizz'})
				record.setCollection()
				o(record.getCollection()).equals(undefined)
				o(record.getFields(collection)).deepEquals(['fizz', undefined])
			})
			o('(@number)', ()=>{
				o(record.getFields(3)).deepEquals([undefined])
				o(record.getFields([3, 4])).deepEquals([undefined, undefined])
			})
			o('(undefined)', ()=>{
				o(record.getFields(undefined)).deepEquals([undefined])
			})
			o('(@string)', ()=>{
				record.setData({foo: 'fizz'})
				o(record.getFields('foo')).deepEquals(['fizz'])
			})
		})
		o.spec('.setCollection', ()=>{
			o('()', ()=>{
				const returnValue = record.setCollection()
				o(returnValue).equals(record)
				o(record.getCollection()).equals(undefined)
			})
			o('(@collection)', ()=>{
				const collection = Collection.create()
				record.setCollection(collection)
				o(record.getCollection()).equals(collection)
				o(collection.getRecords()).deepEquals([record])
			})
			o('(@number)', ()=>{
				o(()=>record.setCollection('ayy')).throws(TypeError)
				o(record.getCollection()).equals(undefined)
			})
			o.spec('when has existing collection', ()=>{
				let firstCollection
				o.beforeEach(()=>{
					firstCollection = Collection.create()
				})
				o('()', ()=>{
					record.setCollection(firstCollection)
					record.setCollection()
					o(record.getCollection()).equals(undefined)
				})
				o('(@sameCollection)', ()=>{
					record.setCollection(firstCollection)
					record.setCollection(firstCollection)
					o(record.getCollection()).equals(firstCollection)
					o(firstCollection.getRecords()).deepEquals([record])
				})
				o('(@otherCollection)', ()=>{
					const secondCollection = Collection.create()
					record.setCollection(firstCollection)
					record.setCollection(secondCollection)
					o(record.getCollection()).equals(secondCollection)
					o(firstCollection.getRecords()).deepEquals([])
					o(secondCollection.getRecords()).deepEquals([record])
				})
			})
		})
	})
})
