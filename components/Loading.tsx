import { CircularProgress, Stack, Typography } from '@mui/material'

export default function Loading() {
  return (
    <Stack height={ 1 } width={ 1 } alignItems={ 'center' } justifyContent={ 'center' } spacing={ 1 }>
      <CircularProgress/>
      <Typography>Loading...</Typography>
    </Stack>
  )
}
