namespace $ {

	export let $hyoo_marked_paragraph = $mol_regexp.from([
		{ content: $mol_regexp.repeat( $mol_regexp.char_any ) },
		$mol_regexp.line_end,
	])
	
}
