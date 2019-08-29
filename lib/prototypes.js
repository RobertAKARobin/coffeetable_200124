Object.defineProperties(Array.prototype, {
	allEqual: {
		value(){
			return this.every(item=>item === this[0])
		}
	},
	extractFrom: {
		value(input){
			if(arguments.length > 0){
				const output = []
				this.forEach(propertyName=>{
					output.push(input[propertyName])
				})
				return output
			}
		}
	},
	first: {
		value(){
			return this[0]
		}
	},
	flat: {
		value(){
			return this.reduce((aggregate, item)=>{
				if(item instanceof Array){
					aggregate = aggregate.concat(item)
				}else{
					aggregate.push(item)
				}
				return aggregate
			}, [])
		}
	},
	insert: {
		value(item, index){
			if(isNaN(index)){
				if(index){
					throw new TypeError('Index must be a number')
				}else{
					index = this.length
				}
			}
			this.splice(index, 0, item)
			return this
		}
	},
	last: {
		value(){
			return this[this.length - 1]
		}
	},
	pad: {
		value(content, targetLength = 0){
			if(isNaN(targetLength) || targetLength === Infinity){
				throw new TypeError('Must pad to a finite number')
			}
			while(this.length < targetLength){
				this.push(content instanceof Function ? content() : content)
			}
			return this
		}
	},
	place: {
		value(item, index){
			if(index && isNaN(index)){
				throw new TypeError('Index must be a number')
			}else{
				if(this.includes(item)){
					this.remove(item)
				}
				this.insert(item, index)
				return this
			}
		}
	},
	remove: {
		value(item){
			this.splice(this.indexOf(item), 1)
			return item
		}
	},
	sortOn: {
		value(callback){
			return this.sort((a,b)=>{
				const valueA = callback(a).toString()
				const valueB = callback(b).toString()
				if(valueA > valueB) return 1
				else if(valueA < valueB) return -1
				else return 0
			})
		}
	},
	without: {
		value(item){
			const index = this.indexOf(item)
			return this.slice(0,index).concat(this.slice(index + 1))
		}
	}
})
Object.defineProperties(Number.prototype, {
	map: {
		value(callback){
			const output = []
			let i = 0
			for(; i < this; i++){
				output.push(callback(i))
			}
			return output
		}
	},
	times: {
		value(input){
			const output = []
			let i = 0
			for(; i < this; i++){
				output.push(input instanceof Function ? input() : input)
			}
			return output
		}
	}
})
