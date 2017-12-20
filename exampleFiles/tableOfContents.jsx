/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let component
if (component == null) {
  component = Scribd.R.component_builder('Books.Menus.TableOfContents')
}

const { PropTypes: types } = React

component({
  propTypes: {
    toc: types.array,
    is_preview: types.bool,
    handle_toc_item_click: types.func,
  },

  componentDidMount() {
    this.hook_tooltips()
    return $(document.body).on('scribd:epub:viewer_ready', () => {
      let toc = []
      if (window.toc != null) {
        ;({ toc } = window)
      } else {
        console.error(
          'Books.Menus.TableOfContents error: window.toc does not exist'
        )
        toc = Scribd.read_page.epub.tableOfContents()
      }
      return this.setState({ is_loading: false, toc })
    })
  },

  getInitialState() {
    return {
      is_loading: window.toc == null || Scribd.read_page == null,
      toc: [],
    }
  },

  widget_css_classes(classes) {
    return `${classes} table_of_contents`
  },

  hide() {
    return this.container()
      .find('.menu_handle')
      .click()
  },

  render() {
    return [
      (this.button_menu = Scribd.R.Shared.React.ButtonMenu({
        force_position: 'bottom right',
        button: this.render_menu_handle(),
        menu: div({ className: 'scroll', children: this.items_list() }),
      })),
    ]
  },

  render_menu_handle() {
    return React.createElement(Scribd.Shared.React.CommonButton, {
      href: '#',
      className: 'text_btn icon_btn toolbar_btn menu_handle',
      data_props: {
        tooltip: I18n.t('books.menus.table_of_contents.table_of_contents'),
      },
      children: [
        this.icon(
          'toc_list',
          I18n.t('books.menus.table_of_contents.table_of_contents_')
        ),
      ],
    })
  },

  items_list() {
    h2(
      { className: 'menu_heading' },
      I18n.t('books.menus.table_of_contents.table_of_contents')
    )

    return ul({
      className: 'button_menu_items',
      role: 'menu',
      children: [
        this.state.is_loading
          ? li(
              { className: 'text_btn is_loading_row' },
              I18n.t('books.menus.table_of_contents.loading')
            )
          : (() => {
              const result = []
              for (let i = 0; i < this.state.toc.length; i++) {
                var chapter = this.state.toc[i]
                var is_available =
                  chapter.preview_chapter || !this.props.is_preview

                const item = (() => {
                  if (is_available) {
                    let page_num = chapter.reference_page_start + 1

                    if (page_num < 10) {
                      page_num = `0${page_num}`
                    }

                    return this.render_chapter_item(page_num, chapter.title)
                  } else {
                    return this.render_unavailable_item(chapter.title)
                  }
                })()

                result.push(
                  li({
                    className: classNames('text_btn', {
                      disabled_row: !is_available,
                    }),
                    'data-idx': i,
                    onClick: this.handle_toc_item_click,
                    role: 'none',
                    children: item,
                  })
                )
              }
              return result
            })(),
      ],
    })
  },

  render_chapter_item(page_num, chapter_title) {
    return [
      a({
        href: '#',
        className: 'chapter_title',
        role: 'menuitem',
        children: [
          span({}, chapter_title),
          span({
            className: 'pull_right page_num',
            children: [this.visually_hidden(', page'), span({}, page_num)],
          }),
        ],
      }),
    ]
  },

  render_unavailable_item(chapter_title) {
    return [
      a({
        href: `#${this.uid(`unavailable-chapter-${chapter_title}`)}`,
        className: 'unavailable_msg',
        role: 'menuitem',
        children: [
          span({ className: 'chapter_title' }, chapter_title),
          div(
            {},
            I18n.t('books.menus.table_of_contents.not_available_in_preview')
          ),
        ],
      }),
    ]
  },

  handle_toc_item_click(e) {
    if ($(e.currentTarget).hasClass('disabled_row')) {
      return false
    }
    const chapter_idx = $(e.currentTarget).data('idx')
    if (this.props.handle_toc_item_click != null) {
      return this.props.handle_toc_item_click(chapter_idx)
    } else {
      return this.goto_chapter(chapter_idx)
    }
  },

  goto_chapter(chapter_idx) {
    const chapter = this.state.toc[chapter_idx]
    this.hide()
    return Scribd.read_page.goto_page(chapter.reference_page_start)
  },
})
