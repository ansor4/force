import React from "react"
import { AuctionsApp_viewer } from "v2/__generated__/AuctionsApp_viewer.graphql"
import { AuctionsMeta } from "./Components/AuctionsMeta"
import { MyBidsFragmentContainer } from "./Components/MyBids/MyBids"
import { Box, Column, GridColumns, Join, Spacer, Text } from "@artsy/palette"
import { createFragmentContainer, graphql } from "react-relay"
import { LazyLoadComponent } from "react-lazy-load-image-component"
import { RecentlyViewedQueryRenderer as RecentlyViewed } from "v2/Components/RecentlyViewed"
import { RouterLink } from "v2/Artsy/Router/RouterLink"
import { RouteTabs, RouteTab } from "v2/Components/RouteTabs"
import { useSystemContext } from "v2/Artsy/useSystemContext"
import { WorksByArtistsYouFollowRailFragmentContainer } from "./Components/WorksByArtistsYouFollowRail/WorksByArtistsYouFollowRail"
import { ChevronButton } from "v2/Components/ChevronButton"

export interface AuctionsAppProps {
  viewer: AuctionsApp_viewer
}

const AuctionsApp: React.FC<AuctionsAppProps> = props => {
  const { children, viewer } = props
  const { user } = useSystemContext()

  return (
    <>
      <AuctionsMeta />
      <GridColumns>
        <Column span={[12, 6]}>
          <Text mt={4} mb={1} variant={["xl", "xxl"]} as="h1">
            Auctions
          </Text>
        </Column>
        <Column span={[12, 6]}>
          <Text variant="md" mt={[0, 4]}>
            Bid on works you love with auctions on Artsy. With bidding opening
            daily, Artsy connects collectors like you to art from leading
            auction houses, nonprofit organizations, and sellers across the
            globe. We feature premium artworks including modern, contemporary,
            and street art, so you can find works by your favorite artists—and
            discover new ones—all in one place.
          </Text>
          <RouterLink
            to="https://support.artsy.net/hc/en-us/sections/360008298773-Bid-at-Auction"
            noUnderline
          >
            <ChevronButton>Learn more about bidding on Artsy</ChevronButton>
          </RouterLink>
        </Column>
      </GridColumns>

      {user && (
        <>
          <Spacer py={2} />
          <Join separator={<Spacer my={[2, 6]} />}>
            <Box>
              <MyBidsFragmentContainer me={viewer.me} />
            </Box>

            <Box>
              <WorksByArtistsYouFollowRailFragmentContainer viewer={viewer} />
            </Box>
          </Join>
        </>
      )}

      <Spacer my={[4, 12]} />

      <RouteTabs mb={2} fill>
        <RouteTab exact to="/auctions">
          Current Auctions
        </RouteTab>
        <RouteTab to="/auctions/upcoming">Upcoming</RouteTab>
        <RouteTab to="/auctions/past">Past</RouteTab>
      </RouteTabs>

      <Box>{children}</Box>

      {typeof window !== "undefined" && (
        <>
          <LazyLoadComponent threshold={1000}>
            <RecentlyViewed />
          </LazyLoadComponent>
        </>
      )}
    </>
  )
}

export const AuctionsAppFragmentContainer = createFragmentContainer(
  AuctionsApp,
  {
    viewer: graphql`
      fragment AuctionsApp_viewer on Viewer {
        ...WorksByArtistsYouFollowRail_viewer

        me {
          ...MyBids_me
        }
      }
    `,
  }
)
