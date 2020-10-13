import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ConventionsService {

  readonly icons: any[] = [
    {
      name: "minus",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='minus-circle' class='svg-inline--fa fa-minus-circle fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z'></path></svg>"
    },
    {
      name: "plus",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='plus-circle' class='svg-inline--fa fa-plus-circle fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z'></path></svg>"
    },
    {
      name: "meh",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='far' data-icon='meh' class='svg-inline--fa fa-meh fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'><path fill='currentColor' d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z'></path></svg>"
    },
    {
      name: "frown",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='far' data-icon='frown' class='svg-inline--fa fa-frown fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'><path fill='currentColor' d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z'></path></svg>"
    },
    {
      name: "smile",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='far' data-icon='smile' class='svg-inline--fa fa-smile fa-w-16' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'><path fill='currentColor' d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z'></path></svg>"
    },
    {
      name: "award",
      icon: "<svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='award' class='svg-inline--fa fa-award fa-w-12' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path fill='currentColor' d='M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z'></path></svg>"
    }
  ];

  static readonly conventions: any[] = [
    {
      "grades": [
        {
          "id": "minus-minus",
          "label": "--",
          "icon": "minus",
          "numerical": 10.0
        },
        {
          "id": "minus",
          "label": "-",
          "icon": "frown",
          "numerical": 30.0
        },
        {
          "id": "x",
          "label": "*",
          "icon": "meh",
          "numerical": 40.0
        },
        {
          "id": "x-plus",
          "label": "*+",
          "icon": "smile",
          "numerical": 55.0
        },
        {
          "id": "plus",
          "label": "+",
          "icon": "plus",
          "numerical": 85.0
        },
        {
          "id": "plus-plus",
          "label": "++",
          "icon": "award",
          "numerical": 100.0
        }
      ],
      "name": "mitarbeit",
      "display": "Mitarbeit"
    },
    {
      "grades": [
        {
          "id": "f",
          "label": "f"
        },
        {
          "id": "e",
          "label": "e"
        }
      ],
      "name": "anwesenheit",
      "display": "Anwesenheit"
    },
    {
      "grades": [
        {
          "id": "1",
          "label": "sehr gut"
        },
        {
          "id": "2x",
          "label": "gut"
        },
        {
          "id": "3",
          "label": "befriedigend"
        }
      ],
      "name": "de.notensystem",
      "display": "Noten"
    },
    {
      "grades": [
        {
          "id": "pending",
          "label": "?",
          "style": "accent"
        }
      ],
      "name": "niedersachsen.ersatzeintrag",
      "display": "Ersatzeintrag"
    }
  ];

  static defaultConvention = 'mitarbeit';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.icons.forEach(i => {
      this.matIconRegistry
        .addSvgIconLiteralInNamespace(
          "grades",
          i.name,
          this.domSanitizer.bypassSecurityTrustHtml(i.icon));
      //console.log('Registered icon for ' + i.name);
    });
  }

  label(grade: string): string {
    if (grade) {
      let res = this.resolve(grade);
      let cnv = ConventionsService.conventions.find(c => c.name === res.convention);
      if (cnv) {
        let g = cnv.grades.find(g => g.id === res.id);
        if (g) return g.label;
      }
    }
    return grade;
  }

  style(): { color: string, "background-color": string, disabled: boolean } {
    return undefined;
  }

  numerical(grade: string): number {
    if (grade) {
      let res = this.resolve(grade);
      let cnv = ConventionsService.conventions.find(c => c.name === res.convention);
      if (cnv) {
        let g = cnv.grades.find(g => g.id === res.id);
        if (g && g.numerical) return g.numerical;
      }
    }
    return undefined;
  }

  icon(grade: string): string {
    if (grade) {
      let res = this.resolve(grade);
      let cnv = ConventionsService.conventions.find(c => c.name === res.convention);
      if (cnv) {
        let g = cnv.grades.find(g => g.id === res.id);
        if (g && g.icon) return 'grades:' + g.icon;
      }
    }
    return undefined;
  }

  resolve(guid: string): { convention: string, id: string } {
    let i = guid.indexOf('#');
    return {
      convention: i === -1 ? ConventionsService.defaultConvention : guid.substring(0, i),
      id: i === -1 ? guid : guid.substring(i + 1)
    };
  }
}
