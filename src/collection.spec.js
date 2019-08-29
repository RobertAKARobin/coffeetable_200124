o.spec('Collection', ()=>{
	'use strict'
	o.spec('.create', ()=>{
		o('()', ()=>{
			const collection = Collection.create()
			o(collection.constructor).equals(Collection)
			o(collection.getRecords()).deepEquals([])
		})
		o('(undefined)', ()=>{
			const input = undefined
			const collection = Collection.create(input)
			o(collection.getRecords()).deepEquals([])
		})
		o('(null)', ()=>{
			const input = null
			const collection = Collection.create(input)
			o(collection.getRecords().length).equals(1)
			o(collection.getRecords().first().getData()).equals(input)
		})
	})
	o.spec('@collection', ()=>{
		o.spec('.addRecord', ()=>{
			let collection, record, initialData, initialRecords, secondCollection, secondCollectionInitialRecords
			o.beforeEach(()=>{
				collection = Collection.create()
				record = Record.create('aaa')
				initialRecords = collection.getRecords()
				initialData = collection.getData()
				secondCollection = Collection.create()
				secondCollection.createRecord('bbb')
				secondCollectionInitialRecords = secondCollection.getRecords()
			})
			o('()', ()=>{
				o(()=>collection.addRecord()).throws(TypeError)
			})
			o('(@object)', ()=>{
				const input = {}
				o(()=>collection.addRecord(input)).throws(TypeError)
			})
			o('(@record)', ()=>{
				const returnValue = collection.addRecord(record)
				o(returnValue).equals(collection)
				o(collection.getRecords()).deepEquals(initialRecords.concat(record))
				o(collection.getRecords().length).equals(initialRecords.length + 1)
			})
			o('(@recordThatBelongsToOtherCollection)', ()=>{
				collection.addRecord(record)
				secondCollection.addRecord(record)
				o(collection.getRecords()).deepEquals(initialRecords)
				o(record.getCollection()).notEquals(collection)
				o(secondCollection.getRecords()).deepEquals(secondCollectionInitialRecords.concat(record))
				o(record.getCollection()).equals(secondCollection)
			})
			o('(@recordThatBelongsToSameCollection)', ()=>{
				collection.addRecord(record)
				collection.addRecord(record)
				o(collection.getRecords()).deepEquals(initialRecords.concat(record))
				o(record.getCollection()).equals(collection)
			})
			o('(@collection)', ()=>{
				collection.addRecord(secondCollection)
				o(collection.getRecords()).deepEquals(initialRecords.concat(secondCollectionInitialRecords))

				const secondCollectionInitialRecordsCollections = secondCollectionInitialRecords.map(r=>r.getCollection())
				o(secondCollectionInitialRecordsCollections).deepEquals((secondCollectionInitialRecords.length).times(collection))
			})
			o('(@array[])', ()=>{
				const input = []
				collection.addRecord(input)
				o(collection.getRecords()).deepEquals(initialRecords)
			})
			o('(@array[@record])', ()=>{
				const input = [record]
				collection.addRecord(input)
				o(collection.getRecords()).deepEquals(initialRecords.concat(record))
			})
			o('(@array[@collection])', ()=>{
				const secondCollectionData = [1, 2, 3]
				const secondCollection = Collection.create(secondCollectionData)
	
				const thirdCollectionData = [4, 5, 6]
				const thirdCollection = Collection.create(thirdCollectionData)
	
				const returnValue = collection.addRecord([secondCollection, thirdCollection])
				o(returnValue).equals(collection)
				o(secondCollection.getRecords()).deepEquals([])
				o(thirdCollection.getRecords()).deepEquals([])
				o(collection.getData()).deepEquals(initialData.concat(secondCollectionData, thirdCollectionData))
			})
		})
		o.spec('.createRecord', ()=>{
			let collection, initialRecords, initialData
			o.beforeEach(()=>{
				collection = Collection.create()
				collection.createRecord({foo: 'bar'})
				initialRecords = collection.getRecords()
				initialData = initialRecords.map(r=>r.getData())
			})
			o('()', ()=>{
				const returnValue = collection.createRecord()
				o(returnValue.constructor).equals(Record)

				const record = returnValue
				o(record.getCollection()).equals(collection)
				o(collection.getRecords()).deepEquals(initialRecords.concat(record))
				o(collection.getRecords().indexOf(record)).equals(initialRecords.length)
				o(collection.getRecords()).deepEquals(initialRecords.concat(returnValue))
			})
			o('(@number)', ()=>{
				const input = 3
				const returnValue = collection.createRecord(input)
				o(returnValue.constructor).equals(Record)
				o(collection.getRecords().length).equals(initialRecords.length + 1)
				o(collection.getRecords().last().getData()).equals(input)
			})
			o('(@object)', ()=>{
				const input = {}
				const returnValue = collection.createRecord(input)
				o(returnValue.constructor).equals(Record)
				o(returnValue.getData()).deepEquals(input)
				o(collection.getRecords().last()).equals(returnValue)
			})
			o('(@array[])', ()=>{
				const input = []
				const returnValue = collection.createRecord(input)
				o(returnValue.constructor).equals(Array)
				o(returnValue).deepEquals(input)
				o(collection.getData()).deepEquals(initialData.concat(input))
			})
			o('(@array[@number])', ()=>{
				const input = [1, 2, 3]
				const returnValue = collection.createRecord(input)
				o(returnValue.constructor).equals(Array)
				o(returnValue.map(r=>r.getData())).deepEquals(input)
				o(collection.getData()).deepEquals(initialData.concat(input))
			})
			o('(@record)', ()=>{
				const inputData = {foo: 'bar'}
				const input = Record.create(inputData)
				const returnValue = collection.createRecord(input)
				o(returnValue).notEquals(input)
				o(returnValue.constructor).equals(Record)
			})
			o('(@collection)', ()=>{
				const secondCollectionInitialData = [1, 2, 3]
				const secondCollection = Collection.create(secondCollectionInitialData)
				const returnValue = collection.createRecord(secondCollection)
				o(returnValue.constructor).equals(Array)
				o(returnValue.map(r=>r.getData())).deepEquals(secondCollectionInitialData)
				o(secondCollection.getData()).deepEquals(secondCollectionInitialData)
				o(collection.getData()).deepEquals(initialData.concat(secondCollectionInitialData))
			})
		})
		o.spec('.getColumns', ()=>{
			let collection
			o.spec('when no existing records', ()=>{
				o.beforeEach(()=>{
					collection = Collection.create()
				})
				o('()', ()=>{
					o(collection.getColumns()).deepEquals([])

					collection.setColumnNames(['foo', 'bar'])
					o(collection.getColumns()).deepEquals([])
				})
				o('(@number)', ()=>{
					o(collection.getColumns(3)).deepEquals([])
				})
			})
			o.spec('when has existing records', ()=>{
				let recordA, recordB, recordC, recordD, initialRecordAData, initialRecordBData, records
				o.beforeEach(()=>{
					initialRecordAData = {foo: 'aaa', fizz: 'buzz'}
					recordA = Record.create(initialRecordAData)
					initialRecordBData = {foo: 'bbb', bizz: 'fuzz'}
					recordB = Record.create(initialRecordBData)
					recordC = Record.create()
					recordD = Record.create('recordD')
					records = [recordA, recordB, recordC, recordD]
					collection = Collection.create(records)
					collection.setColumnNames(['foo', 'zoo'])
				})
				o('()', ()=>{
					let returnValue = collection.getColumns()
					o(returnValue instanceof Array).equals(true)
					o(returnValue.length).equals(records.length)
					o(returnValue[0]).deepEquals(['aaa', undefined])
					o(returnValue[1]).deepEquals(['bbb', undefined])
					o(returnValue[2]).deepEquals([undefined, undefined])
	
					collection.setColumnNames()
					returnValue = collection.getColumns()
					o(returnValue.length).equals(records.length)
					o(returnValue[0]).deepEquals([])
					o(returnValue[1]).deepEquals([])
					o(returnValue[2]).deepEquals([])

					collection.setColumnNames(['bizz'])
					returnValue = collection.getColumns()
					o(returnValue[0]).deepEquals([undefined])
					o(returnValue[1]).deepEquals(['fuzz'])
				})
				o('(@self)', ()=>{
					let returnValue = collection.getColumns(collection)
					o(returnValue[0]).deepEquals(['aaa', undefined])
					o(returnValue[1]).deepEquals(['bbb', undefined])
					o(returnValue[2]).deepEquals([undefined, undefined])
				})
				o('(@otherCollection)', ()=>{
					const otherCollection = Collection.create()
					otherCollection.setColumnNames(['foo'])
					let returnValue = collection.getColumns(otherCollection)
					o(returnValue[0]).deepEquals(['aaa'])
					o(returnValue[1]).deepEquals(['bbb'])
					o(returnValue[2]).deepEquals([undefined])
				})
				o('(@string)', ()=>{
					let returnValue = collection.getColumns('foo')
					o(returnValue[0]).deepEquals(['aaa'])
					o(returnValue[1]).deepEquals(['bbb'])
					o(returnValue[2]).deepEquals([undefined])

					returnValue = collection.getColumns('bar')
					o(returnValue[0]).deepEquals([undefined])
					o(returnValue[1]).deepEquals([undefined])
					o(returnValue[2]).deepEquals([undefined])
				})
				o('(@number)', ()=>{
					let returnValue = collection.getColumns(5)
					o(returnValue[0]).deepEquals([undefined])
					o(returnValue[1]).deepEquals([undefined])
					o(returnValue[2]).deepEquals([undefined])
					o(returnValue[3]).deepEquals(['d'])
				})
				o('(@array)', ()=>{
					let returnValue = collection.getColumns(['foo', 'bar'])
					o(returnValue[0]).deepEquals(['aaa', undefined])
					o(returnValue[1]).deepEquals(['bbb', undefined])
					o(returnValue[2]).deepEquals([undefined, undefined])
				})
			})
		})
		o.spec('.removeRecord', ()=>{
			let collection, initialRecords
			o.beforeEach(()=>{
				collection = Collection.create()
				initialRecords = collection.getRecords()
			})
			o.spec('when no existing records', ()=>{
				o('()', ()=>{
					const returnValue = collection.removeRecord()
					o(returnValue).equals(collection)
					o(collection.getRecords()).deepEquals(initialRecords)
				})
			})
			o.spec('when has existing records', ()=>{
				let record, secondRecord
				o.beforeEach(()=>{
					record = collection.createRecord()
					secondRecord = collection.createRecord()
					initialRecords = collection.getRecords()
				})
				o('()', ()=>{
					const returnValue = collection.removeRecord()
					o(returnValue).equals(collection)
					o(collection.getRecords()).deepEquals(initialRecords)
				})
				o('(@notRecord)', ()=>{
					collection.removeRecord('ayy')
					o(collection.getRecords()).deepEquals(initialRecords)
				})
				o('(@record)', ()=>{
					collection.removeRecord(record)
					o(collection.getRecords()).deepEquals(initialRecords.without(record))
				})
				o('(@array[@record])', ()=>{
					collection.removeRecord([secondRecord])
					o(collection.getRecords()).deepEquals(initialRecords.without(secondRecord))
				})
				o('(self)', ()=>{
					collection.removeRecord(collection)
					o(collection.getRecords()).deepEquals([])
				})
			})
		})
		o.spec('.setColumnNames', ()=>{
			let collection
			o.beforeEach(()=>{
				collection = Collection.create()
			})
			o('()', ()=>{
				const returnValue = collection.setColumnNames()
				o(returnValue).equals(collection)
				o(collection.getColumnNames()).deepEquals([])
			})
			o('(@number)', ()=>{
				const input = 3
				collection.setColumnNames(input)
				o(collection.getColumnNames()).deepEquals([input])
			})
			o('(@string)', ()=>{
				const input = 'foo'
				collection.setColumnNames(input)
				o(collection.getColumnNames()).deepEquals([input])
			})
			o('(@object)', ()=>{
				const input = {}
				o(()=>collection.setColumnNames(input)).throws(TypeError)
			})
			o('(@array[])', ()=>{
				const input = []
				collection.setColumnNames(input)
				o(collection.getColumnNames()).deepEquals(input)
				o(collection.getColumnNames()).notEquals(input)
			})
			o('(@array[@number])', ()=>{
				const input = [0, 1, 2]
				collection.setColumnNames(input)
				o(collection.getColumnNames()).deepEquals(input)
				o(collection.getColumnNames()).notEquals(input)
			})
		})
	})
})
