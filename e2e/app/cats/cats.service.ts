import type { Cat } from "./classes/cat.class";
import type { CreateCatDto } from "./dto/create-cat.dto";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  public create(cat: CreateCatDto): Cat {
    this.cats.push(cat);
    return cat;
  }

  public findOne(id: number): Cat {
    return this.cats[id];
  }
}
