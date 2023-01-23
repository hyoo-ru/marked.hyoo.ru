namespace $.$$ {

	export class $hyoo_marked_app extends $.$hyoo_marked_app {

		preview( next?: string ) {
			return this.$.$mol_state_arg.value( 'preview', next ) ?? ''
		}
		
		pages() {
			return [
				this.Marked() ,
				... this.preview() === 'html' ? [ this.Html() ] : [],
				... this.preview() === 'view' ? [ this.View() ] : [],
			]
		}

		@ $mol_mem
		html() {
			return this.$.$hyoo_marked_to_html( this.marked() )
		}

		@ $mol_mem
		marked( next? : string ) {
			return this.$.$mol_state_arg.value( 'marked' , next )
				?? this.$.$mol_fetch.text( 'hyoo/marked/readme.md' )
					.replace( /```\n*/g, '' )
		}

	}

}
