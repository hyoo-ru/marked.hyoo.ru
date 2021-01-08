namespace $.$$ {

	export class $hyoo_marked_app extends $.$hyoo_marked_app {

		html_show() {
			return this.$.$mol_state_arg.value( 'html' ) === ''
		}

		pages() {
			return [
				this.Marked() ,
				... this.html_show() ? [ this.Html() ] : []
			]
		}

		@ $mol_mem
		html() {
			return this.$.$hyoo_marked_to_html( this.marked() )
		}

		marked( next? : string ) {
			return this.$.$mol_state_arg.value( 'marked' , next )
				?? this.$.$mol_fetch.text( 'hyoo/marked/readme.md' )
					.replace( /```\n*/g, '' )
		}

	}

}
