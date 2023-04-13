namespace $ {

	const { optional, slash_back, char_any, char_except, repeat } = $mol_regexp

	export let $hyoo_marked_line_content = repeat( char_except( '\r\n' ), 1 )

	const uri = repeat( char_except( slash_back ) )
	const content = { content: $hyoo_marked_line_content }
	
	const strong = $mol_regexp.from([ { marker: '**' }, content, '**' ])
	const emphasis = $mol_regexp.from([ { marker: '//' }, content, '//' ])
	const insertion = $mol_regexp.from([ { marker: '++' }, content, '++' ])
	const deletion = $mol_regexp.from([ { marker: '--' }, content, '--' ])
	const code = $mol_regexp.from([ { marker: ';;' }, content, ';;' ])

	const with_uri = $mol_regexp.from([
		optional([
			{ content: $hyoo_marked_line_content },
			slash_back
		]),
		{ uri },
	])

	const link = $mol_regexp.from([ { marker: '\\\\' }, with_uri, '\\\\' ])
	const embed = $mol_regexp.from([ { marker: '""' }, with_uri, '""' ])

	const inline = $mol_regexp.from({ strong, emphasis, insertion, deletion, code, link, embed })

	export let $hyoo_marked_line = $mol_regexp.from({ inline })
	
}
