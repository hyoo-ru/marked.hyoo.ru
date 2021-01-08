namespace $ {

	const { or } = $mol_regexp

	export let $hyoo_marked_script_line = $mol_regexp.from([
		'  ',
		{ marker: [ '  ', or, '++', or, '--', or, '**' ] },
		{ content: $hyoo_marked_line_content },
		$mol_regexp.line_end,
	])

	export let $hyoo_marked_script = $mol_regexp.repeat_greedy( $hyoo_marked_script_line, 1 )

}
