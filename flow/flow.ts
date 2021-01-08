namespace $ {

	export let $hyoo_marked_flow = $mol_regexp.from(
		[
			$mol_regexp.begin,
			{
				cut: $hyoo_marked_cut,
				header: $hyoo_marked_header,
				list: $hyoo_marked_list,
				quote: $hyoo_marked_quote,
				table: $hyoo_marked_table,
				script: $hyoo_marked_script,
				paragraph: $hyoo_marked_paragraph,
			},
		],
		{ multiline: true },
	)

}
