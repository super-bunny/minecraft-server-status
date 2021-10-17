import { Box, Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import { StatusResponse } from 'minecraft-server-util/dist/model/StatusResponse'
import { LoadingButton } from '@mui/lab'
import moment from 'moment'

export interface Props {
  serverStatus: StatusResponse
  displayName?: string
  refreshing?: boolean
  lastUpdate?: Date
  onRefresh?: () => void
}

export default function ServerStatusCard({ serverStatus, displayName, refreshing, lastUpdate, onRefresh }: Props) {
  return (
    <Card sx={ { width: 300 } }>
      <CardMedia
        component="img"
        height="300"
        image={ serverStatus.favicon || undefined }
        alt="server favicon"
      />

      <CardContent>
        <Typography
          mb={ 0 }
          variant="h5"
          component="div"
          gutterBottom
        >{ displayName ?? serverStatus.host }</Typography>

        <Typography
          mb={ 1 }
          variant="body2"
          color="text.secondary"
        >{ serverStatus.description?.descriptionText }</Typography>

        <Box mb={ 1 }>
          <Typography component={ 'span' }>Players: </Typography>
          <Typography color={ 'primary' } component={ 'span' }>{ serverStatus.onlinePlayers }</Typography>
          <span>/</span>
          <Typography component={ 'span' }>{ serverStatus.maxPlayers }</Typography>
        </Box>

        <Stack direction={ 'row' } spacing={ 1 }>
          { serverStatus.samplePlayers?.map(player => (
            <Chip size={ 'small' } label={ player.name } key={ player.id }/>
          )) }
        </Stack>
      </CardContent>

      <CardActions sx={ { justifyContent: 'space-between' } }>
        <LoadingButton
          loading={ refreshing }
          onClick={ () => onRefresh?.() }
          size={ 'small' }
          sx={ { color: 'gray' } }
        >Refresh</LoadingButton>

        { lastUpdate && (
          <Typography variant={ 'caption' } color={ 'gray' }>
            Last update: { moment(lastUpdate).format('HH:mm') }
          </Typography>
        ) }
      </CardActions>
    </Card>
  )
}
