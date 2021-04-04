namespace $ {

	const templates = $$.$mol_tree2_from_string( `
		body {;}
			var
				parent
				(||)
					parent
					()
						document
						[] \\createElement
						(,) \\body
			%body
		element const
			child
			()
				document
				[] \\createElement
				(,) %name
		attr ()
			child
			[] \\setAttribute
			(,)
				%name
				%value
		text const
			child
			()
				document
				[] \\createTextNode
				(,) %text
		content ()
			(,) =>
				parent
				%content
			(,) child
		append ()
			parent
			[] \\appendChild
			(,) child
	`, '$hyoo_marked_tree_to_js_templates' )

	const wrap_body = templates.select( 'body', '' )
	const wrap_element = templates.select( 'element', '' )
	const wrap_attr = templates.select( 'attr', '' )
	const wrap_text = templates.select( 'text', '' )
	const wrap_content = templates.select( 'content', '' )
	const append_child = templates.select( 'append', '' )

	function hack_inline( name: string, link_attr?: string ) {
		return < Belt extends $mol_tree2_belt< any > >(
			input: $mol_tree2,
			belt: Belt,
			context: {},
		)=> {

			const uri = link_attr ? input.kids[0] : null
			const content = link_attr ? input.kids.slice( 1 ) : input.kids

			return [
				input.struct( '{;}', [

					... wrap_element.hack(
						{ '%name': ()=> [ input.data( name ) ] },
						{ ... context, span: input.span },
					),
					
					... uri ? [
						... wrap_attr.hack(
							{
								'%name': ()=> [ uri.data( link_attr! ) ],
								'%value': ()=> [ uri ],
							},
							{ ... context, span: input.span }
						),
					] : [],

					... content.length ? [
						... wrap_content.hack(
							{ '%content': ()=> input.list( content ).hack( belt, context ) },
							{ ... context, span: input.span },
						),
					] : [],

					... append_child.hack( {}, { ... context, span: input.span.slice( -2, -1 ) } ),

				] )
			]
		}
	}

	function hack_text< Belt extends $mol_tree2_belt< any > >(
		input: $mol_tree2,
		belt: Belt,
		context: {},
	) {
		return [
			input.struct( '{;}', [
				... wrap_text.hack(
					{ '%text': ()=> [ input ] },
					{ ... context, span: input.span },
				),
				... append_child.hack( {}, { ... context, span: input.span } ),
			] ),
		]
	}

	export function $hyoo_marked_tree_to_js( this: $, mt: $mol_tree2 ) {

		return mt.list(
			wrap_body.hack({
				'%body': ()=> mt.hack({

					'strong': hack_inline( 'strong' ),
					'emphasis': hack_inline( 'em' ),
					'insertion': hack_inline( 'ins' ),
					'deletion': hack_inline( 'del' ),
					'code': hack_inline( 'code' ),
					'link': hack_inline( 'a', 'href' ),
					'embed': hack_inline( 'object', 'data' ),

					'': hack_text,

				}),
			}),
		)
		
	}

}
