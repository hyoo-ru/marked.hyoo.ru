/** @jsx $mol_jsx */
namespace $ {

	const NL = '\n'

	function flow( marked: string ) {
		return [ ... marked.matchAll( $hyoo_marked_flow ) ].map( found => {
			
			const token = found.groups
			if( !token ) return found[0]
			
			if( token.cut ) {
				return <hr/>
			}
			
			if( token.header ) {
				const level = token.marker.length
				const Tag = `h${level}`
				return <Tag>{NL}{ line( token.content ) }{NL}</Tag>
			}
			
			if( token.list ) {
				const Tag = token.list[0] === '+' ? 'ol' : 'ul'
				return <Tag>{NL}{ list_items( token.list ) }{NL}</Tag>
			}
			
			if( token.table ) {
				return <table>{NL}{ table_rows( token.table ) }{NL}</table>
			}
			
			if( token.script ) {
				return <pre>{NL}{ script_lines( token.script ) }{NL}</pre>
			}
			
			if( token.quote ) {
				return <blockquote>{NL}{ flow( token.quote.replace( /^" /gm, '' ) ) }{NL}</blockquote>
			}
			
			if( token.paragraph ) {
				if( !token.content ) return ''
				return <p>{NL}{ line( token.content ) }{NL}</p>
			}
			
			return $mol_fail( new SyntaxError( `Unknown token` ) )

		} ).filter( Boolean )
	}
	
	function table_cells( marked: string ) {
		
		const tokens = [ ... marked.matchAll( $hyoo_marked_table_line ) ]
		const cols = [] as ( typeof tokens )[]
		
		for( const token of tokens ) {
			const index = Math.ceil( token.groups!.indent.length / 2 )
			const col = cols[ index ] || ( cols[ index ] = [] )
			col.push( token )
		}

		return cols.map( col => {
			const lines = col.map( line => line.groups!.content )
			return <td>{NL}{ flow( lines.join( '\n' ) + '\n' ) }{NL}</td>
		} )

	}
	
	function table_rows( marked: string ) {
		return [ ... marked.matchAll( $hyoo_marked_table_row ) ].map( token => {
			
			return <tr>{NL}{ table_cells( token.groups!.content ) }{NL}</tr>
			
		} ).filter( Boolean )
	}
	
	function list_items( marked: string ) {
		return [ ... marked.matchAll( $hyoo_marked_list_item ) ].map( token => {

			const kids = token.groups!.kids.replace( /^  /gm, '' )

			return <li>{NL}{ flow( token.groups!.content.replace( /^  /gm, '' ) + '\n' ) }{ flow( kids ) }{NL}</li>
			
		} ).filter( Boolean )
	}
	
	function script_lines( marked: string ) {
		return [ ... marked.matchAll( $hyoo_marked_script_line ) ].map( token => {

			if( token.groups!.marker === '++' ) return <ins>${ token.groups!.content }{NL}</ins>
			if( token.groups!.marker === '--' ) return <del>${ token.groups!.content }{NL}</del>
			if( token.groups!.marker === '**' ) return <strong>${ token.groups!.content }{NL}</strong>

			return <span>{ token.groups!.content }{NL}</span>
			
		} ).filter( Boolean )
	}
	
	function line( marked: string ) {
		return [ ... marked.matchAll( $hyoo_marked_line ) ].map( found => {
			
			const token = found.groups!
			if( !token ) return <span>found[0]</span>
			
			if( token.strong ) {
				return <strong>{ line( token.content ) }</strong>
			}
			
			if( token.emphasis ) {
				return <em>{ line( token.content ) }</em>
			}
			
			if( token.insertion ) {
				return <ins>{ line( token.content ) }</ins>
			}
			
			if( token.deletion ) {
				return <del>{ line( token.content ) }</del>
			}
			
			if( token.code ) {
				return <code>{ token.content }</code>
			}
			
			if( token.link ) {
				return <a href={ token.uri }>{ line( token.content || token.uri ) }</a>
			}
			
			if( token.embed ) {
				return <object data={ token.uri }>{ line( token.content || token.uri ) }</object>
			}
			
			return token[0]

		} ).filter( Boolean )
	}
	
	export function $hyoo_marked_to_dom(
		this: $,
		marked: string,
	) {
		return <body>{ flow( marked + '\n' ) }</body>
	}

}
