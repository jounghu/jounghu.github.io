const { Component } = require('inferno');
const Article = require('./common/article');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const script = `<script src="https://readmore.openwrite.cn/js/readmore.js" type="text/javascript"></script>
            <script>
                const btw = new BTWPlugin();
                btw.init({
                    id: "article-content",
                    blogId: '10053-1610820399501-222',
                    name: 'Kirito的技术分享',
                    qrcode: 'http://kirito.iocoder.cn/qrcode_for_gh_c06057be7960_258%20%281%29.jpg',
                    keyword: 'more'
                });
                var rm_btn = $('#read-more-btn');
                rm_btn.html('~阅读全文~人机检测~');
            </script>
            `;
        return <>
        <Article config={config} page={page} helper={helper} index={false} />
        <div dangerouslySetInnerHTML={{__html: script}}></div>
        </>;
    }
};
