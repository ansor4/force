import { ContextModule, Intent } from "@artsy/cohesion"
import { Box, Text } from "@artsy/palette"
import { ArtistHeader_artist } from "v2/__generated__/ArtistHeader_artist.graphql"
import { HorizontalPadding } from "v2/Apps/Components/HorizontalPadding"
import { Mediator, SystemContextConsumer } from "v2/Artsy"
import { track } from "v2/Artsy/Analytics"
import * as Schema from "v2/Artsy/Analytics/Schema"
import { FollowArtistButtonFragmentContainer as FollowArtistButton } from "v2/Components/FollowButton/FollowArtistButton"
import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { get } from "v2/Utils/get"
import { openAuthToFollowSave } from "v2/Utils/openAuthModal"
import { Media } from "v2/Utils/Responsive"
import { highestCategory } from "./MarketInsights/MarketInsights"
import { RouterLink } from "v2/Artsy/Router/RouterLink"

const CATEGORIES = {
  "blue-chip": "Blue Chip Representation",
  "top-established": "Established Representation",
  "top-emerging": "Emerging Representation",
}

const getHighCategory = (artist: ArtistHeader_artist) => {
  const {
    artistHighlights: { partnersConnection },
  } = artist
  return highestCategory(partnersConnection?.edges)
}

const getTopAuctionResult = (artist: ArtistHeader_artist) => {
  return get(
    artist,
    () => artist.auctionResultsConnection.edges[0].node.price_realized.display
  )
}

const formatFollowerCount = (n: number) => {
  try {
    const formatter = Intl.NumberFormat("en-US", {
      // https://github.com/microsoft/TypeScript/issues/36533
      // @ts-ignore
      notation: "compact",
      compactDisplay: "short",
    })

    return formatter.format(n).toLocaleLowerCase()
  } catch (error) {
    return n
  }
}

const handleOpenAuth = (mediator, artist) => {
  openAuthToFollowSave(mediator, {
    entity: artist,
    contextModule: ContextModule.artistHeader,
    intent: Intent.followArtist,
  })
}

interface ArtistHeaderProps {
  artist: ArtistHeader_artist
  user?: User
  mediator?: Mediator
}

@track<ArtistHeaderProps>(
  props =>
    ({
      context_module: "Header",
      // TODO: Old schema for the Follow button
      modelName: "artist",
      entity_slug: props.artist.slug,
      entity_id: props.artist.internalID,
    } as Schema.ContextModule & Schema.Old)
)
export class ArtistHeader extends Component<ArtistHeaderProps> {
  render() {
    const props = this.props
    return (
      <SystemContextConsumer>
        {({ mediator, user }) => {
          return (
            <>
              <span id="jumpto-ArtistHeader" />

              <Media at="xs">
                <SmallArtistHeader mediator={mediator} user={user} {...props} />
              </Media>

              <Media greaterThan="xs">
                <LargeArtistHeader mediator={mediator} user={user} {...props} />
              </Media>
            </>
          )
        }}
      </SystemContextConsumer>
    )
  }
}

export const LargeArtistHeader: React.FC<ArtistHeaderProps> = ({
  user,
  artist,
  mediator,
}) => {
  const topAuctionResult = getTopAuctionResult(artist)
  const highCategory = getHighCategory(artist)

  return (
    <HorizontalPadding>
      <Box pt={3}>
        <Text as="h1" variant="largeTitle">
          {artist.name}
        </Text>

        <Box display="flex" mt={1} justifyContent="space-between">
          <Box display="flex" as="dl">
            {artist.formattedNationalityAndBirthday && (
              <Box mr={3}>
                <Text as="dt" color="black60">
                  Bio
                </Text>

                <Box as="dd">
                  <Text as="h2" mr={2}>
                    {artist.formattedNationalityAndBirthday}
                  </Text>
                </Box>
              </Box>
            )}

            {(topAuctionResult || highCategory) && (
              <Box mr={3}>
                <Text as="dt" color="black60">
                  Status
                </Text>

                <Text as="dd">
                  {topAuctionResult && (
                    <div>
                      <RouterLink
                        to={`/artist/${artist.slug}/auction-results`}
                        noUnderline
                      >
                        {topAuctionResult} Auction Record
                      </RouterLink>
                    </div>
                  )}

                  {highCategory && (
                    <div>
                      <RouterLink to={`/artist/${artist.slug}/cv`} noUnderline>
                        {CATEGORIES[highCategory]}
                      </RouterLink>
                    </div>
                  )}
                </Text>
              </Box>
            )}

            {/**
             * 0 followers is still displayed in this case:
             * "displaying 0 helps the layout stay together"
             */}
            <Box mr={3}>
              <Text as="dt" color="black60">
                Followers
              </Text>

              <Text as="dd">{formatFollowerCount(artist.counts.follows)}</Text>
            </Box>
          </Box>

          <FollowArtistButton
            useDeprecatedButtonStyle={false}
            artist={artist}
            user={user}
            onOpenAuthModal={() => handleOpenAuth(mediator, artist)}
          >
            Follow
          </FollowArtistButton>
        </Box>
      </Box>
    </HorizontalPadding>
  )
}

export const SmallArtistHeader: React.FC<ArtistHeaderProps> = ({
  user,
  artist,
  mediator,
}) => {
  const topAuctionResult = getTopAuctionResult(artist)
  const highCategory = getHighCategory(artist)

  return (
    <Box data-test={ContextModule.artistHeader} textAlign="center">
      <Text as="h1" variant="largeTitle" mt={3} mb={1}>
        {artist.name}
      </Text>

      {(artist.formattedNationalityAndBirthday ||
        artist.counts.follows > 0) && (
        <Box>
          <Text as="h2" display="inline">
            {artist.formattedNationalityAndBirthday}
          </Text>

          {artist.formattedNationalityAndBirthday &&
            artist.counts.follows > 0 && <Text as="span">{" • "}</Text>}

          {artist.counts.follows > 0 && (
            <Text as="span">
              {formatFollowerCount(artist.counts.follows)} follower
              {artist.counts.follows === 1 ? "" : "s"}
            </Text>
          )}
        </Box>
      )}

      {topAuctionResult && (
        <Text>
          <RouterLink to={`/artist/${artist.slug}/auction-results`} noUnderline>
            {topAuctionResult} Auction Record
          </RouterLink>
        </Text>
      )}

      {highCategory && (
        <Text>
          <RouterLink to={`/artist/${artist.slug}/cv`} noUnderline>
            {CATEGORIES[highCategory]}
          </RouterLink>
        </Text>
      )}

      <Box mt={1.5}>
        <FollowArtistButton
          user={user}
          artist={artist}
          useDeprecatedButtonStyle={false}
          buttonProps={{ size: "small" }}
          onOpenAuthModal={() => handleOpenAuth(mediator, artist)}
        />
      </Box>
    </Box>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(
  ArtistHeader,
  {
    artist: graphql`
      fragment ArtistHeader_artist on Artist
        @argumentDefinitions(
          partnerCategory: {
            type: "[String]"
            defaultValue: ["blue-chip", "top-established", "top-emerging"]
          }
        ) {
        artistHighlights: highlights {
          partnersConnection(
            first: 10
            displayOnPartnerProfile: true
            representedBy: true
            partnerCategory: $partnerCategory
          ) {
            edges {
              node {
                categories {
                  slug
                }
              }
            }
          }
        }
        auctionResultsConnection(
          recordsTrusted: true
          first: 1
          sort: PRICE_AND_DATE_DESC
        ) {
          edges {
            node {
              price_realized: priceRealized {
                display(format: "0a")
              }
              organization
              sale_date: saleDate(format: "YYYY")
            }
          }
        }
        internalID
        slug
        name
        formattedNationalityAndBirthday
        counts {
          follows
          forSaleArtworks
        }
        ...FollowArtistButton_artist
      }
    `,
  }
)
