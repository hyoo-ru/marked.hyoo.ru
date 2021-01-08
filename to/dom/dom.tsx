/** @jsx $mol_jsx */
namespace $ {

	const NL = '\n'

	function flow( marked: string ) {
		return [ ... $hyoo_marked_flow.parse( marked ) ].map( token => {
			
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
			
			return token[0]

		} ).filter( Boolean )
	}
	
	function table_cells( marked: string ) {
		
		const tokens = [ ... $hyoo_marked_table_line.parse( marked ) ]
		const cols = [] as ( typeof tokens )[]
		
		for( const token of tokens ) {
			const index = Math.ceil( token.indent.length / 2 )
			const col = cols[ index ] || ( cols[ index ] = [] )
			col.push( token )
		}

		return cols.map( col => {
			const lines = col.map( line => line.content )
			return <td>{NL}{ flow( lines.join( '\n' ) + '\n' ) }{NL}</td>
		} )

	}
	
	function table_rows( marked: string ) {
		return [ ... $hyoo_marked_table_row.parse( marked ) ].map( token => {
			
			return <tr>{NL}{ table_cells( token.content ) }{NL}</tr>
			
		} ).filter( Boolean )
	}
	
	function list_items( marked: string ) {
		return [ ... $hyoo_marked_list_item.parse( marked ) ].map( token => {

			const kids = token.kids.replace( /^  /gm, '' )

			return <li>{NL}{ flow( token.content + '\n' ) }{ flow( kids ) }{NL}</li>
			
		} ).filter( Boolean )
	}
	
	function script_lines( marked: string ) {
		return [ ... $hyoo_marked_script_line.parse( marked ) ].map( token => {

			if( token.marker === '++' ) return <ins>${ token.content }{NL}</ins>
			if( token.marker === '--' ) return <del>${ token.content }{NL}</del>
			if( token.marker === '**' ) return <strong>${ token.content }{NL}</strong>

			return <span>{ token.content }{NL}</span>
			
		} ).filter( Boolean )
	}
	
	function line( marked: string ) {
		return [ ... $hyoo_marked_line.parse( marked ) ].map( token => {
			
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
				return <span> <code>{ line( token.content ) }</code> </span>
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
