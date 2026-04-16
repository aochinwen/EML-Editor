import { renderElementHtmlWithPostProcessing, buildEmailHtml } from './src/utils/htmlRenderer.js';

const element = {
  type: 'content-single',
  id: 'test-1',
  props: {
    title: 'Test',
    body: 'Test body',
    elementPadding: '0px'
  }
};

const html = renderElementHtmlWithPostProcessing(element);
console.log(html);
