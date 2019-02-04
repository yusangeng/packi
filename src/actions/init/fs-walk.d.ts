declare module 'fs-walk' {
  type FCallback = (basedir: string, filename: string, stat: any, next: () => void) => void
  type FFinishCallback = (err: Error | null) => void

  type Walk = {
    walk: (dir: string, callback: FCallback, finishCallback: FFinishCallback) => void
  }

  const walk: Walk

  export default walk
}