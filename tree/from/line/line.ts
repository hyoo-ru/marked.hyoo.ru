namespace $ {

	const marker2name = {
		'**': 'strong',
		'//': 'emphasis',
		'++': 'insertion',
		'--': 'deletion',
		';;': 'code',
		'\\\\': 'link',
		'""': 'embed',
	}
	
	export function $hyoo_marked_tree_from_line( this: $, code: string, span_entire = $mol_span.unknown ) {

		let span = span_entire.slice( 0, 0 )
		const nodes = [] as $mol_tree2[]
	
		for( const token of $hyoo_marked_line.parse( code ) ) {
	
			if( token.inline ) {

				const uri_sep_length = token.uri.length + ( token.uri && token.content ? 1 : 0 )
				span = span.after( token.marker.length * 2 + token.content.length + uri_sep_length )
				const span_content = span.slice( token.marker.length, - token.marker.length )

				const content = token.code
					? [ $mol_tree2.data( token.content, [], span_content ) ]
					: [
						... token.uri ? [
							$mol_tree2.data( token.uri, [], span_content.slice( - uri_sep_length ) )
						] : [],
						... token.content ? this.$hyoo_marked_tree_from_line(
							token.content,
							span_content.slice( 0, - uri_sep_length ),
						).kids : [],
					]
				
				const name = marker2name[ token.marker ]
				if( !name ) this.$mol_fail( `Undefined name for marker ${ token.marker }` )

				nodes.push(
					$mol_tree2.struct( name, content, span ),
				)

			} else {
				
				span = span.after( token[0].length )
				nodes.push(
					$mol_tree2.data( token[0], [], span )
				)

			}
	
		}

		return $mol_tree2.list( nodes, span_entire )
	
	}

}
