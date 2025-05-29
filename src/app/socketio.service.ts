import { Injectable } from '@angular/core';
import { UserHttpService } from './user-http.service';
import { Observable } from 'rxjs';
import { io, Socket } from "socket.io-client"

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  constructor(private us: UserHttpService) {  }


  connect(flightId: string): Observable<any> {
    return new Observable((observer) => {
      let socket = io(this.us.url);

      // Register a callback when the "broadcast" event is received
      socket.on(flightId, (m:any) => {
        console.log('Socket.io message received: ' + JSON.stringify(m) );
        observer.next( m ); // Here we notify the subscriber that a new value is available

      });

      // Register a callback when the "error" event occurrs
      socket.on('error', (err:any) => {
        console.log('Socket.io error: ' + err );
        observer.error( err ); // Here we notify the subscriber that an error occurred
      });

      return { 
        unsubscribe: () => {
          // When the observer unsubscribes, we disconnect from the websocket
          // to get ready for the next subscription.
          socket.disconnect();
        } 
      };

    })
  }



}

