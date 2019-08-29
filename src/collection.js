function Collection(input){
	Collection.definePrivateScopeAccessors.call(this)
	if(input !== undefined){
		this.createRecord(input)
	}
}
Collection.definePrivateScopeAccessors = function(){
	const pvt = {
		records: [],
		columnNames: []
	}
	Object.defineProperties(this, {
		addRecord: {
			value: function(inputData, inputPlace){
				if(inputData instanceof Record){
					const record = inputData
					if(record.getCollection() !== this){
						record.setCollection(this)
					}
					if(!pvt.records.includes(record)){
						if(isNaN(parseInt(inputPlace))){
							pvt.records.push(record)
						}else{
							pvt.records.splice(inputPlace, 0, record)
						}
					}
				}else if(inputData instanceof Collection){
					const collection = inputData
					collection.getRecords().forEach(record=>this.addRecord(record, inputPlace))
				}else if(inputData instanceof Array){
					const array = inputData
					array.forEach(record=>this.addRecord(record, inputPlace))
				}else{
					throw Coffeetable.rejectInputError('@collection.addRecord', inputData)
				}
				return this
			}
		},
		getColumnNames: {
			value: function(){
				return Array.from(pvt.columnNames)
			}
		},
		getRecords: {
			value: function(){
				return Array.from(pvt.records)
			}
		},
		removeRecord: {
			value: function(input){
				if(input instanceof Record){
					const record = input
					if(pvt.records.includes(record)){
						pvt.records.remove(record)
					}
					if(record.getCollection() === this){
						record.setCollection()
					}
				}else if(input instanceof Array){
					const array = input
					array.forEach(this.removeRecord.bind(this))
				}else if(input instanceof Collection){
					const collection = input
					collection.getRecords().forEach(this.removeRecord.bind(this))
				}
				return this
			}
		},
		setColumnNames: {
			value: function(input){
				if(input instanceof Array){
					pvt.columnNames = Array.from(input)
				}else if(typeof input === 'string' || typeof input === 'number'){
					pvt.columnNames = [input]
				}else if(input === undefined || input === null || input === false){
					pvt.columnNames = []
				}else{
					throw Coffeetable.rejectInputError('@collection.setColumnNames', input)
				}
				return this
			}
		}
	})
}
Object.defineProperties(Collection, {
	create: {
		value: function(){
			return new Collection(...arguments)
		}
	}
})
Object.defineProperties(Collection.prototype, {
	createRecord: {
		value: function(inputData, inputPlace){
			return Record.create(inputData, this, inputPlace)
		}
	},
	getColumns: {
		value: function(input){
			let columnNames
			if(arguments.length === 0){
				columnNames = this.getColumnNames()
			}else{
				if(input instanceof Collection){
					const collection = input
					columnNames = collection.getColumnNames()
				}else if(input instanceof Array){
					columnNames = input
				}else{
					columnNames = [input]
				}	
			}
			return this.getRecords().map(record=>record.getColumns(columnNames))
		}
	},
	getData: {
		value: function(){
			return this.getRecords().map(r=>r.getData())
		}
	},
	toJSON: {
		value: function(){
			return {
				records: this.getRecords()
			}
		}
	}
})
