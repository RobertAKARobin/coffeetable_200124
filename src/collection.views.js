Collection.component = {
	view: function(vnode){
		const collection = vnode.attrs.collection
		return m('[data-collection]', [
			m('[data-head]', [
				m('[data-row]', [
					m('div'),
					collection.getFieldNames().map(fieldName=>m('div', fieldName))
				])
			]),
			m('[data-body]', [
				collection.getRecords().map((record, recordIndex)=>m('[data-row][data-record]', [
					m('div', [
						m('button', {
							onclick: ()=>collection.createRecord(null, recordIndex + 1)
						}, 'Add'),
						m('button', {
							onclick: ()=>collection.removeRecord(record)
						}, 'Remove')
					]),
					record.getFields().map(value=>m('div', value === false ? 'false' : value))
				]))
			])
		])
	}
}
