import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, effect, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { configure } from '../opentelemetry'
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-root',
  template: `
    <h1>{{ title() }}</h1>
    @for (item of content(); track item.id) {
      <p>{{ item.id}} | {{item.name}} | {{item.price}}</p>
    }
    <p></p>
  `,
})
export class AppComponent {

  // c = effect(() => {
  //   if (this.otel().length === 2) {
  //     configure(this.otel()[0], this.otel()[1])
  //   }
  // })

  httpClient = inject(HttpClient);

  keycloakService = inject(KeycloakService);

  // private otel = toSignal(this.httpClient.get<string[]>("/api/otel/"), { initialValue: [] });

  content = toSignal(this.httpClient.get<Product[]>("/api/"));

  secure = toSignal(this.httpClient.get<string>("/api/secure"));

  //private token = toSignal(from(this.keycloakService.getToken()));

  title = computed(() => "User token:" /*+ this.token()*/);

}

type Product =
  {
    id: number,
    name: string,
    price: number,
  }


