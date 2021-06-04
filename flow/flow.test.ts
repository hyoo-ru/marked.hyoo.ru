namespace $ {
	$mol_test({

		'header level 1'() {
			
			const res = [ ... `= text\n`.matchAll( $hyoo_marked_flow ) ][0].groups!

			$mol_assert_equal( res.header, '= text\n' )
			$mol_assert_equal( res.marker, '=' )
			$mol_assert_equal( res.content, 'text' )
			
		},

		'header level 6'() {
			
			const res = [ ... `====== text\n`.matchAll( $hyoo_marked_flow ) ][0].groups!

			$mol_assert_equal( res.header, '====== text\n' )
			$mol_assert_equal( res.marker, '======' )
			$mol_assert_equal( res.content, 'text' )
			
		},

		'header level too many'() {
			
			const res = [ ... `======= text\n`.matchAll( $hyoo_marked_flow ) ][0].groups!

			$mol_assert_equal( res.paragraph, '======= text\n' )
			$mol_assert_equal( res.content, '======= text' )
			
		},

		'different blocks'() {
			
			const text = `
				= header
				paragraph
				= header
			`.replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ]
			
			$mol_assert_equal( res[0].groups!.paragraph, '\n' )
			$mol_assert_equal( res[0].groups!.content, '' )

			$mol_assert_equal( res[1].groups!.header, '= header\n' )
			$mol_assert_equal( res[1].groups!.marker, '=' )
			$mol_assert_equal( res[1].groups!.content, 'header' )
			
			$mol_assert_equal( res[2].groups!.paragraph, 'paragraph\n' )
			$mol_assert_equal( res[2].groups!.content, 'paragraph' )
			
			$mol_assert_equal( res[3].groups!.header, '= header\n' )
			$mol_assert_equal( res[3].groups!.marker, '=' )
			$mol_assert_equal( res[3].groups!.content, 'header' )
			
		},

		'plain list'() {
			
			const text = `
				- foo
				- bar
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.list, '- foo\n- bar\n' )
			
		},

		'nested lists'() {
			
			const text = `
				- foo
				  + bar
				- lol
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.list, '- foo\n  + bar\n- lol\n' )
			
		},

		'quote'() {
			
			const text = `
				" foo
				" bar
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.quote, '" foo\n" bar\n' )
			
		},

		'quote in list'() {
			
			const text = `
				- foo
				  " bar
				- lol
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.list, '- foo\n  " bar\n- lol\n' )
			
		},

		'table'() {
			
			const text = `
				! foo
				  ! bar
				! lol
				  ! 777
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.table, '! foo\n  ! bar\n! lol\n  ! 777\n' )
			
		},

		'script'() {
			
			const text = `
			    foo
			  ++bar
			  --lol
			  **777
			`.slice(1).replace( /^\t+/gm, '' )

			const res = [ ... text.matchAll( $hyoo_marked_flow ) ][0].groups!
			
			$mol_assert_equal( res.script, '    foo\n  ++bar\n  --lol\n  **777\n' )
			
		},

	})
}
