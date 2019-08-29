function Coffeetable(){}
Object.defineProperties(Coffeetable, {
	rejectInputError: {
		value: function(method, input){
			return new TypeError(`${method} does not accept input of type ${input ? input.constructor.name : input}`)
		}
	}
})