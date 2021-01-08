namespace $ {

	export function $hyoo_marked_to_html(
		this: $,
		marked: string,
	) {
		return this.$hyoo_marked_to_dom( marked ).innerHTML
	}

}
