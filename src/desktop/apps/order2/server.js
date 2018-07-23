import { renderLayout } from '@artsy/stitch'
import express from 'express'
import React from 'react'
import { routes } from 'reaction/Apps/Order/routes'

import { buildServerApp } from 'reaction/Router'
import styled from 'styled-components'

const app = (module.exports = express())

app.get('/order2/:orderID*', async (req, res, next) => {
  try {
    const user = req.user && req.user.toJSON()

    const { ServerApp, redirect, status } = await buildServerApp({
      initialBreakpoint: res.locals.sd.IS_MOBILE ? 'xs' : false,
      routes,
      url: req.url,
      user,
    })

    if (redirect) {
      res.redirect(302, redirect.url)
      return
    }

    // FIXME: Move this to Reaction
    const Container = styled.div`
      width: 100%;
      max-width: 1192px;
      margin: auto;
    `

    // Render layout
    const layout = await renderLayout({
      basePath: __dirname,
      layout:
        '../../components/main_layout/templates/react_minimal_header.jade',
      config: {
        styledComponents: true,
      },
      blocks: {
        body: () => (
          <Container>
            <ServerApp />
          </Container>
        ),
      },
      locals: {
        ...res.locals,
        assetPackage: 'order2',
      },
    })

    res.status(status).send(layout)
  } catch (error) {
    console.log('(apps/order2) Error: ', error)
    next(error)
  }
})

export default app
