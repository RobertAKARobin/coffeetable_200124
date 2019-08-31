function Collection(input){
	Collection.definePrivateScopeAccessors.call(this)
	if(input !== undefined){
		this.createRecord(input)
	}
}
Collection.definePrivateScopeAccessors = function(){
	const pvt = {
		records: [],
		fieldNames: []
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
		getFieldNames: {
			value: function(){
				return Array.from(pvt.fieldNames)
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
		setFieldNames: {
			value: function(input){
				if(input instanceof Array){
					pvt.fieldNames = Array.from(input)
				}else if(typeof input === 'string' || typeof input === 'number'){
					pvt.fieldNames = [input]
				}else if(input === undefined || input === null || input === false){
					pvt.fieldNames = []
				}else{
					throw Coffeetable.rejectInputError('@collection.setFieldNames', input)
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
	getFields: {
		value: function(input){
			let fieldNames
			if(arguments.length === 0){
				fieldNames = this.getFieldNames()
			}else{
				if(input instanceof Collection){
					const collection = input
					fieldNames = collection.getFieldNames()
				}else if(input instanceof Array){
					fieldNames = input
				}else{
					fieldNames = [input]
				}	
			}
			return this.getRecords().map(record=>record.getFields(fieldNames))
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
