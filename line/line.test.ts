namespace $ {
	$mol_test({

		'strong'() {
			const res = [ ... '**text**'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.strong, '**text**' )
			$mol_assert_equal( res.marker, '**' )
			$mol_assert_equal( res.content, 'text' )
		},
		
		'emphasis'() {
			const res = [ ... '//text//'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.emphasis, '//text//' )
			$mol_assert_equal( res.marker, '//' )
			$mol_assert_equal( res.content, 'text' )
		},
		
		'insertion'() {
			const res = [ ... '++text++'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.insertion, '++text++' )
			$mol_assert_equal( res.marker, '++' )
			$mol_assert_equal( res.content, 'text' )
		},
		
		'deletion'() {
			const res = [ ... '--text--'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.deletion, '--text--' )
			$mol_assert_equal( res.marker, '--' )
			$mol_assert_equal( res.content, 'text' )
		},
		
		'code'() {
			const res = [ ... ';;text;;'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.code, ';;text;;' )
			$mol_assert_equal( res.marker, ';;' )
			$mol_assert_equal( res.content, 'text' )
		},
		
		'nested simple'() {
			const res = [ ... '**//foo//bar**'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.strong, '**//foo//bar**' )
			$mol_assert_equal( res.marker, '**' )
			$mol_assert_equal( res.content, '//foo//bar' )
		},

		'nested simple overlap'() {
			const res = [ ... '**//foo**bar//'.matchAll( $hyoo_marked_line ) ]
			$mol_assert_equal( res[0].groups!.strong, '**//foo**' )
			$mol_assert_equal( res[0].groups!.marker, '**' )
			$mol_assert_equal( res[0].groups!.content, '//foo' )
			$mol_assert_equal( res[1][0], 'bar//' )
		},

		'link'() {
			const res = [ ... '\\\\text\\url\\\\'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.link, '\\\\text\\url\\\\' )
			$mol_assert_equal( res.marker, '\\\\' )
			$mol_assert_equal( res.content, 'text' )
			$mol_assert_equal( res.uri, 'url' )
		},
		
		'embed'() {
			const res = [ ... '""text\\url""' .matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.embed, '""text\\url""' )
			$mol_assert_equal( res.marker, '""' )
			$mol_assert_equal( res.content, 'text' )
			$mol_assert_equal( res.uri, 'url' )
		},
		
		'link with embed'() {
			const res = [ ... '\\\\""text\\url1""\\url2\\\\'.matchAll( $hyoo_marked_line ) ][0].groups!
			$mol_assert_equal( res.link, '\\\\""text\\url1""\\url2\\\\' )
			$mol_assert_equal( res.marker, '\\\\' )
			$mol_assert_equal( res.content, '""text\\url1""' )
			$mol_assert_equal( res.uri, 'url2' )
		},
		
	})
}
