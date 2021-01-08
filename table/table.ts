namespace $ {

	export let $hyoo_marked_table_line = $mol_regexp.from([
		{ indent: $mol_regexp.repeat('  ') },
		{ marker: '!' },
		' ',
		{ content: $hyoo_marked_line_content },
		$mol_regexp.line_end,
	])

	export let $hyoo_marked_table_row = $mol_regexp.from({ content: [
		$hyoo_marked_table_line,
		$mol_regexp.repeat_greedy([
			'  ',
			$hyoo_marked_line_content,
			$mol_regexp.line_end,
		]),
	] })

	export let $hyoo_marked_table = $mol_regexp.repeat_greedy( $hyoo_marked_table_line, 1 )

}
