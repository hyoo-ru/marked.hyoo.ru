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
				const level = token.marker.length as 1|2|3|4|5|6
				const Tag = `h${level}` as const
				return <Tag style="break-after: avoid">{NL}{ line( token.content ) }{NL}</Tag>
			}
			
			if( token.list ) {
				const Tag = token.list[0] === '+' ? 'ol' : 'ul'
				const style = 'break-before: avoid;' + ( Tag === 'ul' ? ` list-style-type: ' – ';` : `` )
				return <Tag style={ style }>{NL}{ list_items( token.list ) }{NL}</Tag>
			}
			
			if( token.table ) {
				return <table>{NL}{ table_rows( token.table ) }{NL}</table>
			}
			
			if( token.script ) {
				return <pre>{NL}{ script_lines( token.script ) }{NL}</pre>
			}
			
			if( token.quote ) {
				return <blockquote style="break-before: avoid">{NL}{ flow( token.quote.replace( /^" /gm, '' ) ) }{NL}</blockquote>
			}
			
			if( token.paragraph ) {
				
				if( !token.content ) return ''
				
				const content = line( token.content )
				
				if( content.length !== 1 ) return <p>{NL}{ content }{NL}</p>
				if( typeof content[0] === 'string' ) return <p>{NL}{ content }{NL}</p>
					
				switch( content[0].localName ) {
					case 'object': return content[0]
					default: return <p>{NL}{ content }{NL}</p>
				}
				
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

			return <li>{ flow( token.groups!.content.replace( /^  /gm, '' ) + '\n' ) }{ flow( kids ) }</li>
			
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
			if( !token ) return <span>{ found[0] }</span>
			
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
				
				if( /\b(png|gif|jpg|jpeg|jfif|webp|svg)\b/.test( token.uri ) ) {
					return <img src={ token.uri } alt={ token.content } />
				}
				
				return (
					<object data={ token.uri }>
						{NL}
						<iframe src={ token.uri }>
							{ token.uri }
						</iframe>
						{NL}
					</object>
				)
				
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
