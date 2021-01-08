namespace $ {

	export let $hyoo_marked_list_line = $mol_regexp.from([
		{ indent: $mol_regexp.repeat('  ') },
		{ marker: [ '-', $mol_regexp.or, '+' ] },
		' ',
		{ content: $hyoo_marked_line_content },
		$mol_regexp.line_end,
	])

	export let $hyoo_marked_list_item = $mol_regexp.from([
		$hyoo_marked_list_line,
		{ kids: $mol_regexp.repeat_greedy([
			'  ',
			$hyoo_marked_line_content,
			$mol_regexp.line_end,
		]) },
	])

	export let $hyoo_marked_list = $mol_regexp.repeat_greedy( $hyoo_marked_list_line, 1 )

}
