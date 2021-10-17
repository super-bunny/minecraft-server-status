import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { StatusResponse } from 'minecraft-server-util/dist/model/StatusResponse'
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material'
import Center from '../components/Center'
import Loading from '../components/Loading'
import ServerStatusCard from '../components/ServerStatusCard'
import moment from 'moment'

const SERVER_DISPLAY_NAME = process.env.NEXT_PUBLIC_MC_SERVER_DISPLAY_NAME
const AUTO_REFRESH_DELAY = process.env.NEXT_PUBLIC_AUTO_REFRESH_DELAY
  ? parseInt(process.env.NEXT_PUBLIC_AUTO_REFRESH_DELAY)
  : 60000

const Home: NextPage = () => {
  const [serverStatus, setServerStatus] = useState<StatusResponse>()
  const [lastUpdate, setLastUpdate] = useState<Date>()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = () => {
    setLoading(true)
    setError(false)

    fetch('/api/server-status')
      .then(async response => {
        if (response.status !== 200) {
          setError(true)
          return
        }
        const data = await response.json()
        setServerStatus(data)
        setLastUpdate(new Date())
      })
      .catch(error => {
        console.error(error)
        setError(true)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    console.info('Auto refresh delay:', AUTO_REFRESH_DELAY)

    refresh()
  }, [])

  useEffect(() => {
    if (!autoRefresh) {
      return
    }

    const intervalId = setInterval(() => refresh(), AUTO_REFRESH_DELAY)

    return () => clearTimeout(intervalId)
  }, [autoRefresh])

  return (
    <div style={ { height: '100%' } }>
      <Head>
        <title>Minecraft Server Status</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main style={ { height: '100%' } }>
        <Center>
          <Stack alignItems={ 'center' } spacing={ 1 }>
            { loading && !serverStatus && <Loading/> }

            { error && !loading && (
              <>
                <Typography
                  variant={ 'body2' }
                  color={ 'gray' }
                >Last update: { moment(lastUpdate).format('HH:mm') }</Typography>

                <Alert
                  severity={ 'error' }
                  action={ <Button onClick={ () => refresh() } color="inherit" size="small">Refresh</Button> }
                >Unable to contact minecraft server</Alert>
              </>
            ) }

            { serverStatus && (
              <ServerStatusCard
                serverStatus={ serverStatus }
                displayName={ SERVER_DISPLAY_NAME }
                refreshing={ loading }
                lastUpdate={ lastUpdate }
                onRefresh={ () => refresh() }
              />
            ) }

            { !loading && (
              <FormGroup>
                <FormControlLabel
                  label="Auto refresh status"
                  control={
                    <Checkbox
                      checked={ autoRefresh }
                      onChange={ event => setAutoRefresh(event.target.checked) }
                      size={ 'small' }
                    />
                  }
                />
              </FormGroup>
            ) }
          </Stack>
        </Center>
      </main>
    </div>
  )
}

export default Home
