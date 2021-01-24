namespace $ {

	// {
	//   const child = document.createElement( 'object' );
	//   child.setAttribute( 'data', 'http://example.org' );
	//   ((parent)=>{
	//     ...
	//   })(child);
	//   parent.appendChild( child );
	// }
	function hack_inline( name: string, link_attr?: string ) {
		return ( input: $mol_tree2, belt: Record< string, $mol_tree2_hack< never > > )=> {

			const uri = link_attr ? input.kids[0] : null
			const content = link_attr ? input.kids.slice( 1 ) : input.kids
			const end = new $mol_tree2( input.type, input.value, input.kids, input.span.slice( -2, -1 ) )

			return [
				input.struct( '{;}', [

					input.struct( 'const', [
						input.struct( 'child' ),
						input.struct( '()', [
							input.struct( 'document' ),
							input.struct( '[]', [
								input.data( 'createElement' ),
							] ),
							input.struct( '(,)', [
								input.data( name ),
							] ),
						] ),
					] ),
					
					... uri ? [
						uri.struct( '()', [
							uri.struct( 'child' ),
							uri.struct( '[]', [
								uri.data( 'setAttribute' ),
							] ),
							uri.struct( '(,)', [
								uri.data( link_attr! ),
								uri,
							] ),
						] )
					] : [],

					... content.length ? [
						input.struct( '()', [
							input.struct( '(,)', [
								input.struct( '=>', [
									input.struct( 'parent' ),
									... input.list( content ).hack( belt ),
								] ),
							] ),
							end.struct( '(,)', [
								end.struct( 'child' ),
							] ),
						] )
					] : [],

					end.struct( '()', [
						end.struct( 'parent' ),
						end.struct( '[]', [
							end.data( 'appendChild' ),
						] ),
						end.struct( '(,)', [
							end.struct( 'child' ),
						] ),
					] ),

				] )
			]
		}
	}

	// {
	//   const child = document.createTextNode( 'foo' );
	//   parent.appendChild( child );
	// }
	function hack_text( input: $mol_tree2, belt: Record< string, $mol_tree2_hack< never > > ) {
		return [
			input.struct( '{;}', [
				
				input.struct( 'const', [
					input.struct( 'child' ),
					input.struct( '()', [
						input.struct( 'document' ),
						input.struct( '[]', [
							input.data( 'createTextNode' ),
						] ),
						input.struct( '(,)', [ input ] ),
					] ),
				] ),
				
				input.struct( '()', [
					input.struct( 'parent' ),
					input.struct( '[]', [
						input.data( 'appendChild' ),
					] ),
					input.struct( '(,)', [
						input.struct( 'child' ),
					] ),
				] ),

			] ),
		]
	}

	export function $hyoo_marked_tree_to_js( this: $, mt: $mol_tree2 ) {

		return mt.list([
			mt.struct(
				'{;}',
				mt.hack({

					'strong': hack_inline( 'strong' ),
					'emphasis': hack_inline( 'em' ),
					'insertion': hack_inline( 'ins' ),
					'deletion': hack_inline( 'del' ),
					'code': hack_inline( 'code' ),
					'link': hack_inline( 'a', 'href' ),
					'embed': hack_inline( 'object', 'data' ),

					'': hack_text,

				}),
			) 
		])
		
	}

}
