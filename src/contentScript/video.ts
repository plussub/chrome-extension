import { VideoMap } from './VideoMap';
import { postMessage } from './postMessage';
import { filter, mergeMap, skip, takeUntil } from 'rxjs/operators';
import { fromEvent, merge, Observable } from 'rxjs';
import { create as _createVideoElementMutationObservable } from './videoElementMutationObservable';
import { MessageEventFromPopup } from './types';

interface Payload {
  messageObservable: Observable<MessageEventFromPopup<string>>;
  connectionObservable: Observable<boolean>;
}

interface Result {
  videoMap: VideoMap;
}

export const init = ({ messageObservable, connectionObservable }: Payload): Result => {
  const videoMap = new VideoMap();
  const findVideos = () =>
    postMessage({
      plusSubActionFromContentScript: 'FIND_VIDEOS_RESULT',
      videos: videoMap.addAllAndRemoveWhichAreNotIncluded([...document.querySelectorAll('video')])
    });

  messageObservable.pipe(filter((e) => e.data.plusSubActionFromPopup === 'FIND_VIDEOS')).subscribe(() => findVideos());


  const disconnect = connectionObservable.pipe(
    skip(1),
    filter((c) => !c)
  );

  const createVideoElementMutationObservable = () =>
    _createVideoElementMutationObservable().pipe(
      filter(({ added }) => added.length > 0),
      takeUntil(disconnect),
      mergeMap(({ added }) => merge(...added.map((el) => fromEvent(el, 'loadedmetadata').pipe(takeUntil(disconnect)))))
    );

  const createLoadedmetadataObservables = () => [...document.querySelectorAll('video')].map((el) => fromEvent(el, 'loadedmetadata').pipe(takeUntil(disconnect)));

  connectionObservable
    .pipe(
      filter((v) => v),
      mergeMap(() => merge(...createLoadedmetadataObservables(), createVideoElementMutationObservable()))
    )
    .subscribe(() => {
      findVideos();
    });

  return {
    videoMap
  };
};