unless component?
  component = Scribd.R.component_builder "Books.Menus.TableOfContents"

{PropTypes: types} = React

component {
  propTypes: {
    toc: types.array
    is_preview: types.bool
    handle_toc_item_click: types.func
  }

  componentDidMount: ->
    @hook_tooltips()
    $(document.body).on "scribd:epub:viewer_ready", =>
      toc = []
      if window.toc?
        toc = window.toc
      else
        console.error "Books.Menus.TableOfContents error: window.toc does not exist"
        toc = Scribd.read_page.epub.tableOfContents()
      @setState is_loading: false, toc: toc

  getInitialState: ->
    {
      is_loading: !window.toc? || !Scribd.read_page?
      toc: []
    }

  widget_css_classes: (classes) ->
    "#{classes} table_of_contents"

  hide: ->
    @container().find(".menu_handle").click()

  render: ->
    [
      @button_menu = Scribd.R.Shared.React.ButtonMenu {
        force_position: "bottom right"
        button: @render_menu_handle()
        menu: div className: "scroll", children: @items_list()
      }
    ]

  render_menu_handle: ->
    React.createElement Scribd.Shared.React.CommonButton, {
      href: "#"
      className: "text_btn icon_btn toolbar_btn menu_handle"
      data_props: {
        tooltip:I18n.t('books.menus.table_of_contents.table_of_contents')
      }
      children: [
        @icon "toc_list", I18n.t('books.menus.table_of_contents.table_of_contents_')
      ]
    }


  items_list: ->
    h2 className: "menu_heading", I18n.t('books.menus.table_of_contents.table_of_contents')

    ul className: "button_menu_items", role: "menu", children: [
      if @state.is_loading
        li className: "text_btn is_loading_row", I18n.t('books.menus.table_of_contents.loading')
      else
        for chapter, i in @state.toc
          is_available = chapter.preview_chapter || !@props.is_preview

          item = if is_available
            page_num = chapter.reference_page_start + 1

            if page_num < 10
              page_num = "0#{page_num}"

            @render_chapter_item page_num, chapter.title
          else
            @render_unavailable_item chapter.title

          li className: classNames("text_btn", { disabled_row: !is_available }), "data-idx": i, onClick: @handle_toc_item_click, role: "none", children: item
    ]

  render_chapter_item: (page_num, chapter_title) ->
    [
      a href: "#", className: "chapter_title", role: "menuitem", children: [
        span {}, chapter_title
        span className: "pull_right page_num", children: [
          @visually_hidden ", page"
          span {}, page_num
        ]
      ]
    ]

  render_unavailable_item: (chapter_title) ->
    [
      a href: "##{@uid "unavailable-chapter-#{chapter_title}"}", className: "unavailable_msg", role: "menuitem", children: [
        span className: "chapter_title", chapter_title
        div {}, I18n.t('books.menus.table_of_contents.not_available_in_preview')
      ]
    ]

  handle_toc_item_click: (e) ->
    return false if $(e.currentTarget).hasClass("disabled_row")
    chapter_idx = $(e.currentTarget).data("idx")
    if @props.handle_toc_item_click?
      @props.handle_toc_item_click chapter_idx
    else
      @goto_chapter chapter_idx

  goto_chapter: (chapter_idx) ->
    chapter = @state.toc[chapter_idx]
    @hide()
    Scribd.read_page.goto_page chapter.reference_page_start
}
