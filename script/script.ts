namespace $ {

	const { or, tab, char_any, repeat, line_end, vary } = $mol_regexp

	export let $hyoo_marked_script_line = $mol_regexp.from([
		vary([
			tab,
			[ '  ', { marker: [ '  ', or, '++', or, '--', or, '**' ] } ],
		]),
		{ content: repeat( char_any ) },
		line_end,
	])

	export let $hyoo_marked_script = $mol_regexp.repeat_greedy( $hyoo_marked_script_line, 1 )

}
