import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale("es");
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export default dayjs;
