namespace $ {

	export let $hyoo_marked_quote_line = $mol_regexp.from([
		{ marker: '"' },
		' ',
		{ content: $hyoo_marked_line_content },
		$mol_regexp.line_end,
	])

	export let $hyoo_marked_quote = $mol_regexp.repeat_greedy( $hyoo_marked_quote_line, 1 )

}
