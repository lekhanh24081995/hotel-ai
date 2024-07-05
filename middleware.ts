import { stackMiddlewares } from './middlewares/stackMiddlewares';
import { withAuth } from './middlewares/withAuth';
import { withHeaders } from './middlewares/withHeaders';
import { withI18n } from './middlewares/withI18n';

export default stackMiddlewares([withAuth, withHeaders, withI18n]);
