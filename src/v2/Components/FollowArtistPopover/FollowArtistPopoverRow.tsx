import { EntityHeader } from "@artsy/palette"
import { FollowArtistPopoverRow_artist } from "v2/__generated__/FollowArtistPopoverRow_artist.graphql"
import { FollowArtistPopoverRowMutation } from "v2/__generated__/FollowArtistPopoverRowMutation.graphql"
import { SystemContextProps } from "v2/System"
import React from "react"
import {
  RelayProp,
  commitMutation,
  createFragmentContainer,
  graphql,
} from "react-relay"
import { Subscribe } from "unstated"
import { FollowArtistPopoverState } from "./state"
import { FollowButton } from "../FollowButton/Button"

interface Props extends SystemContextProps {
  artist: FollowArtistPopoverRow_artist
  excludeArtistIdsState?: FollowArtistPopoverState
  relay: RelayProp
}

interface State {
  swappedArtist: FollowArtistPopoverRow_artist
  followed: boolean
}

class FollowArtistPopoverRow extends React.Component<Props, State> {
  state: State = {
    // @ts-expect-error STRICT_NULL_CHECK
    swappedArtist: null,
    followed: false,
  }

  handleClick(artistID: string) {
    const { user, relay, excludeArtistIdsState } = this.props
    const {
      // @ts-expect-error STRICT_NULL_CHECK
      state: { excludeArtistIds },
    } = excludeArtistIdsState
    if (user && user.id) {
      commitMutation<FollowArtistPopoverRowMutation>(relay.environment, {
        // TODO: Inputs to the mutation might have changed case of the keys!
        mutation: graphql`
          mutation FollowArtistPopoverRowMutation(
            $input: FollowArtistInput!
            $excludeArtistIds: [String]!
          ) {
            followArtist(input: $input) {
              artist {
                id
                related {
                  suggestedConnection(
                    first: 1
                    excludeFollowedArtists: true
                    excludeArtistIDs: $excludeArtistIds
                  ) {
                    edges {
                      node {
                        id
                        internalID
                        ...FollowArtistPopoverRow_artist @relay(mask: false)
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: { artistID, unfollow: false },
          excludeArtistIds,
        },
        optimisticUpdater: () => {
          this.setState({
            followed: true,
          })
        },
        updater: (_store, data) => {
          const {
            // @ts-expect-error STRICT_NULL_CHECK
            node,
            // @ts-expect-error STRICT_NULL_CHECK
          } = data.followArtist.artist.related.suggestedConnection.edges[0]

          // Add slight delay to make UX seem a bit nicer
          this.setState(
            {
              followed: true,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  swappedArtist: (node as unknown) as FollowArtistPopoverRow_artist,
                  followed: false,
                })
              }, 500)
            }
          )

          // @ts-expect-error STRICT_NULL_CHECK
          excludeArtistIdsState.addArtist(node.internalID)
        },
      })
    }
  }

  render() {
    const { artist: originalArtist } = this.props
    const { swappedArtist } = this.state
    const artist = swappedArtist || originalArtist
    const imageUrl = artist.image?.cropped?.url
    const { internalID: artistID } = artist

    return (
      <EntityHeader
        name={artist.name!}
        meta={artist.formattedNationalityAndBirthday!}
        imageUrl={imageUrl}
        FollowButton={
          <FollowButton
            isFollowed={this.state.followed}
            handleFollow={() => this.handleClick(artistID)}
            buttonProps={{ size: "small", variant: "secondaryOutline" }}
          />
        }
      />
    )
  }
}

export const FollowArtistPopoverRowFragmentContainer = createFragmentContainer(
  (props: Props) => {
    return (
      <Subscribe to={[FollowArtistPopoverState]}>
        {(excludeArtistIdsState: FollowArtistPopoverState) => {
          return (
            <FollowArtistPopoverRow
              excludeArtistIdsState={excludeArtistIdsState}
              {...props}
            />
          )
        }}
      </Subscribe>
    )
  },
  {
    artist: graphql`
      fragment FollowArtistPopoverRow_artist on Artist {
        internalID
        name
        formattedNationalityAndBirthday
        image {
          cropped(width: 45, height: 45) {
            url
          }
        }
      }
    `,
  }
)
