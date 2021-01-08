namespace $ {

	function flow( marked: string ): string {
		return [ ... $mol_regexp_mt_flow.parse( marked ) ].map( token => {
			
			if( token.cut ) {
				return '<hr/>'
			}
			
			if( token.header ) {
				const level = token.marker.length
				const tag = `h${level}`
				return `\n<${tag}>${ line( token.content ) }</${tag}>\n`
			}
			
			if( token.list ) {
				const tag = token.list[0] === '+' ? 'ol' : 'ul'
				return `<${tag}>\n${ list_items( token.list ) }\n</${tag}>`
			}
			
			if( token.table ) {
				return `<table>\n${ table_rows( token.table ) }\n</table>`
			}
			
			if( token.script ) {
				return `<pre>\n${ script_lines( token.script ) }\n</pre>`
			}
			
			if( token.quote ) {
				return `<blockquote>\n${ flow( token.quote.replace( /^" /gm, '' ) ) }\n</blockquote>`
			}
			
			if( token.paragraph ) {
				if( !token.content ) return ''
				return `<p>${ line( token.content ) }</p>`
			}
			
			return token[0]

		} ).filter( Boolean ).join('\n')
	}
	
	function table_cells( marked: string ): string {
		
		const tokens = [ ... $mol_regexp_mt_table_line.parse( marked ) ]
		const cols = [] as ( typeof tokens )[]
		
		for( const token of tokens ) {
			const index = Math.ceil( token.indent.length / 2 )
			const col = cols[ index ] || ( cols[ index ] = [] )
			col.push( token )
		}

		return cols.map( col => {
			const lines = col.map( line => line.content )
			return `<td>\n${ flow( lines.join( '\n' ) + '\n' ) }\n</td>`
		} ).join( '\n' )

	}
	
	function table_rows( marked: string ): string {
		return [ ... $mol_regexp_mt_table_row.parse( marked ) ].map( token => {
			
			return `<tr>\n${ table_cells( token.content ) }\n</tr>`
			
		} ).filter( Boolean ).join('\n')
	}
	
	function list_items( marked: string ): string {
		return [ ... $mol_regexp_mt_list_item.parse( marked ) ].map( token => {

			const kids = token.kids.replace( /^  /gm, '' )

			return `<li>${ flow( token.content + '\n' ) } \n${ flow( kids ) }</li>`
			
		} ).filter( Boolean ).join('\n')
	}
	
	function script_lines( marked: string ): string {
		return [ ... $mol_regexp_mt_script_line.parse( marked ) ].map( token => {

			if( token.marker === '++' ) return `<ins>${ token.content }</ins>`
			if( token.marker === '--' ) return `<del>${ token.content }</del>`
			if( token.marker === '**' ) return `<strong>${ token.content }</strong>`

			return `${ token.content }`
			
		} ).filter( Boolean ).join('\n')
	}
	
	function line( marked: string ): string {
		return [ ... $mol_regexp_mt_line.parse( marked ) ].map( token => {
			
			if( token.strong ) {
				return `<strong>${ line( token.content ) }</strong>`
			}
			
			if( token.emphasis ) {
				return `<em>${ line( token.content ) }</em>`
			}
			
			if( token.insertion ) {
				return `<ins>${ line( token.content ) }</ins>`
			}
			
			if( token.deletion ) {
				return `<del>${ line( token.content ) }</del>`
			}
			
			if( token.code ) {
				return ` <code>${ line( token.content ) }</code> `
			}
			
			if( token.link ) {
				return `<a href="${ token.uri }">${ line( token.content || token.uri ) }</a>`
			}
			
			if( token.embed ) {
				return `<object data="${ token.uri }">${ line( token.content || token.uri ) }</object>`
			}
			
			return token[0]

		} ).filter( Boolean ).join('')
	}
	
	export function $hyoo_marked_to_html(
		this: $,
		marked: string,
	) {
		return flow( marked + '\n' )
	}

}
