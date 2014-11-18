_ = require 'underscore'
{ resolve } = require 'path'
{ fabricate } = require 'antigravity'
rewire = require 'rewire'
benv = require 'benv'
Backbone = require 'backbone'
sinon = require 'sinon'
Notifications = require '../../../../collections/notifications.coffee'
Artworks = require '../../../../collections/artworks.coffee'
CurrentUser = require '../../../../models/current_user.coffee'
Artist = require '../../../../models/artist.coffee'
{ stubChildClasses } = require '../../../../test/helpers/stubs'

describe 'NotificationsView', ->
  before (done) ->
    benv.setup ->
      benv.expose $: benv.require 'jquery'
      Backbone.$ = $
      done()

  after ->
    benv.teardown()

  describe 'without artist_id', ->
    beforeEach (done) ->
      sinon.stub Backbone, 'sync'
      sinon.stub CurrentUser, 'orNull'
      CurrentUser.orNull.returns new CurrentUser fabricate 'user'
      benv.render resolve(__dirname, '../../templates/index.jade'), { sd: {} }, =>
        { @NotificationsView, @init } = mod = benv.requireWithJadeify resolve(__dirname, '../../client/index'), ['template']
        stubChildClasses mod, this,
          ['ArtworkColumnsView']
          ['render']
        $.onInfiniteScroll = sinon.stub()
        @view = new @NotificationsView el: $('body')
        done()

    afterEach ->
      Backbone.sync.restore()
      CurrentUser.orNull.restore()

    describe '#initialize', ->
      it 'makes the right API call', ->
        _.last(Backbone.sync.args)[2].url.should.containEql '/api/v1/notifications'
        _.last(Backbone.sync.args)[2].data.should.containEql type: 'ArtworkPublished', since: 30, page: 1, size: 10

      it 'groups and renders properly', ->
        bittyArtwork1 = fabricate 'artwork', published_changed_at: '2012-05-07T04:00:00+00:00', artist: fabricate 'artist', { id: 'bitty', name: 'Bitty Z' }
        bittyArtwork2 = fabricate 'artwork', published_changed_at: '2012-05-07T04:00:00+00:00', artist: fabricate 'artist', { id: 'bitty', name: 'Bitty Z' }
        percyArtwork1 = fabricate 'artwork', published_changed_at: '2012-05-06T04:00:00+00:00', artist: fabricate 'artist', { id: 'percy', name: 'Percy Z' }
        _.last(Backbone.sync.args)[2].success([ bittyArtwork1, bittyArtwork2, percyArtwork1 ])
        @view.$el.find('.notifications-list-item').length.should.equal 2 # One for Bitty, One for Percy
        @view.$el.html().should.containEql 'Bitty Z'
        @view.$el.html().should.containEql 'Percy Z'
        @view.$el.html().should.containEql "/artist/bitty"
        @view.$el.html().should.containEql "/artist/percy"
        @view.$el.html().should.containEql "2 works added"
        @view.$el.html().should.containEql "1 work added"

    describe '#toggleForSale', ->
      it 'turns on the for_sale boolean in the fetch and starts from the first page', ->
        @view.nextPage()
        _.last(Backbone.sync.args)[2].data.should.containEql page: 2
        @view.$('#for-sale').click()
        _.last(Backbone.sync.args)[2].data.should.containEql
          for_sale: true
          type: 'ArtworkPublished'
          since: 30
          page: 1
          size: 10

  describe 'with an artist_id param', ->
    beforeEach (done) ->
      sinon.stub Backbone, 'sync'
      sinon.stub CurrentUser, 'orNull'
      CurrentUser.orNull.returns new CurrentUser fabricate 'user'
      benv.render resolve(__dirname, '../../templates/index.jade'), { sd: {} }, =>
        { @NotificationsView, @init } = mod = benv.requireWithJadeify resolve(__dirname, '../../client/index'), ['template']
        stubChildClasses mod, this,
          ['ArtworkColumnsView']
          ['render']
        $.onInfiniteScroll = sinon.stub()
        sinon.stub(@NotificationsView::, 'params').returns artist_id: 'foobar'
        @view = new @NotificationsView el: $('body')
        done()

    afterEach ->
      Backbone.sync.restore()
      CurrentUser.orNull.restore()
      @view.params.restore()

    it 'fetches the artist slug first; pins it', ->
      @view.$pins.find('.notifications-list-item').length.should.equal 1
      Backbone.sync.args[0][1].url().should.containEql 'api/v1/artist/foobar'
      Backbone.sync.args[1][1].url.should.containEql 'api/v1/artist/foobar/artworks?published=true'

    it 'accomodates artists that 404'
