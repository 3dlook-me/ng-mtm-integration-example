import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-mt-button',
  templateUrl: './mt-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MtButtonComponent implements OnInit {
  @Input() publicKey: string;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
  ) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://mtm-widget.3dlook.me/saia-pf-button.js';
    this.renderer.appendChild(this.document.head, script);
    script.addEventListener('load', async () => {
      await this.initButton();
    });
  }

  async initButton(): Promise<void> {
    const SaiaMTMButton = (window as any).SaiaMTMButton;

    try {
      const publicKey = this.publicKey;

      const [isWidgetAllowed, customSettings] = await SaiaMTMButton.getWidgetInfo(publicKey);

      if (isWidgetAllowed) {
        const button = new SaiaMTMButton({
          publicKey,
          widgetUrl: 'https://mtm-widget.3dlook.me',
          customSettings,
        });

        button.init(publicKey);
      }
    } catch (err) {
      if (err?.response?.data) {
        console.error(err.response.data.detail);
      } else {
        console.error(err.message);
      }
    }
  }

}
