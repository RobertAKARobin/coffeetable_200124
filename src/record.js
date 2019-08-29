function Record(inputData, collection, inputPlace){
	if(inputData instanceof Record){
		const originalRecord = inputData
		return new Record(originalRecord.getData(), collection)
	}else if(inputData instanceof Collection){
		const inputCollection = inputData
		return new Record(inputCollection.getRecords(), collection)
	}else if(inputData instanceof Array){
		const array = inputData
		return array.map(item => new Record(item, collection)).flat()
	}else if(inputData && inputData.records instanceof Array){
		const array = inputData.records
		return array.map(item => new Record(item, collection)).flat()
	}else{
		Record.definePrivateScopeAccessors.call(this)
		this.setData(inputData)
		this.setCollection(collection, inputPlace)
		return this
	}
}
Record.definePrivateScopeAccessors = function(){
	const pvt = {
		collection: undefined,
		data: {}
	}
	Object.defineProperties(this, {
		getCollection: {
			value: function(){
				return pvt.collection
			}
		},
		setCollection: {
			value: function(inputData, inputPlace){
				if(inputData === undefined || inputData === null || inputData === false){
					const collection = pvt.collection
					pvt.collection = undefined
					if(collection instanceof Collection){
						collection.removeRecord(this)
					}
				}else if(inputData instanceof Collection){
					const collection = inputData
					if(pvt.collection){
						pvt.collection.removeRecord(this)
					}
					pvt.collection = collection
					collection.addRecord(this, inputPlace)
				}else{
					throw Coffeetable.rejectInputError('@record.setCollection', inputData)
				}
				return this
			}
		},
		getData: {
			value: function(){
				return pvt.data
			}
		},
		setData: {
			value: function(input){
				pvt.data = input
			}
		}
	})
}
Object.defineProperties(Record, {
	create: {
		value: function(){
			return new Record(...arguments)
		}
	}
})
Object.defineProperties(Record.prototype, {
	getColumns: {
		value: function(input){
			if(arguments.length === 0){
				const collection = this.getCollection()
				if(collection === undefined){
					return []
				}else{
					input = collection
				}
			}
			let data = this.getData()
			if(data === undefined || data === null){
				data = {}
			}
			let columnNames
			if(input instanceof Collection){
				const collection = input
				columnNames = collection.getColumnNames()
			}else if(input instanceof Array){
				columnNames = input
			}else{
				columnNames = [input]
			}
			return columnNames.extractFrom(data)
		}
	},
	toJSON: {
		value: function(){
			return {
				data: this.getData()
			}
		}
	}
})
