namespace $ {

	export let $hyoo_marked_header = $mol_regexp.from([
		{ marker: $mol_regexp.repeat_greedy( '=', 1, 6 ) },
		' ',
		{ content: $hyoo_marked_line_content },
		$mol_regexp.line_end,
	])
	
}
