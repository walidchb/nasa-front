export default function renderTitle(router: any) {
  switch (router) {
    case '/apod':
      return 'Astronomy Picture of the Day';
    case '/mars-rover':
      return 'Mars Rover Photos';

    default:
      return 'NASA Explorer';
  }
}
