import React from 'react'
import styled from 'styled-components'
import { Link } from './components/Link'
import { ROUTES } from './routes'

const MOBILE_WIDTH = 952
const MainContent = styled.div`
  background-color: white;
  padding: 5px 60px;

  h1 {
    color: #444;
    text-align: center;
  }
  h2 {
    color: #888;
    text-align: left;
  }
  p {
    color: #333;
    text-align: justify;
  }

  ul,
  ol {
    color: #333;
  }

  hr {
    border-top: none;
    border-top-color: currentcolor;
    border-color: #ddd;
  }

  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    padding: 5px 10px;
  }
`

export const RightsAndObligations = () => {
  return (
    <MainContent>
      <Link to={ROUTES.submit}>
        <small>⟵ обратно</small>
      </Link>
      <h1>Права и задължения</h1>
      <hr />
      <p>
        Защитниците на вота имат специален статут в изборното законодателство
      </p>

      <p>
        Защитниците на вота присъстват в изборните секции в ролята на
        „застъпници“ или “представители на коалиция/партия”, тъй като това е
        статутът, който е определен за тях в изборното ни законодателство.
      </p>

      <p>
        Участниците в националната кампания „Ти броиш“ формално ще бъдат
        застъпници или представители на „Продължаваме Промяната - Демократична
        България“, което ще им даде право да присъстват във всяка изборна секция
        в предварително избрания изборен район.
      </p>

      <p>
        Както за всички участници в изборния процес, така и за застъпниците и
        представителите на коалиция важи забраната за агитация в предизборния и
        в изборния ден.
      </p>

      <p>
        Ако секцията, в която ще присъствате при броенето на вота, е различна от
        секцията, в която можете да упражните правото си на глас (според
        избирателните списъци), трябва да упражните правото си на глас в
        съответната секция и тогава да отидете в тази, в която ще присъствате в
        ролята на защитник на вота.
      </p>
      <p>
        Всеки защитник на вота ще се легитимира в изборната секция със специално
        издаден документ за застъпник или представител на коалицията, както и с
        бадж с определени от ЦИК (Централна избирателна комисия) формат и
        размери.
      </p>

      <p>Всеки защитник на вота има права</p>

      <p>
        За да се гарантират честни и демократични избори, защитниците на вота
        (т.нар. застъпници или представители на коалиция „Продължаваме Промяната
        - Демократична България) имат редица права по време на изборния ден.
      </p>

      <p>
        Преди изборния ден застъпниците/представителите на коалиция имат право
        да присъстват на заседанията на избирателните комисии и да изказват
        мнения, становища и възражения, които се записват в протокола. В
        изборния ден застъпниците/представители на коалиция имат право да
        присъстват в изборното помещение при откриването и закриването на
        изборния ден, по време на гласуването, както и при отварянето на
        избирателните кутии и при установяване на резултатите от вота, както и
        да получат право на пряка видимост към всички тези процеси.
      </p>

      <p>
        Застъпникът/представителят на коалиция има право да присъства при
        въвеждането в изчислителните пунктове на данните от протоколите на СИК
        (Секционна избирателна комисия) с резултатите от гласуването в
        избирателните секции.
      </p>

      <p>
        Застъпникът има право да подава жалби и сигнали за нарушения на изборния
        процес:
      </p>

      <p>
        - пред съответната СИК (Секционна избирателна комисия) – за нарушения в
        нейния район (напр. агитиране близо до секцията);
      </p>

      <p>
        - пред съответната РИК (Районна избирателна комисия) – за нарушения от
        страна на СИК и други нарушения на изборния ден;
      </p>

      <p>
        - пред ЦИК (Централната избирателна комисия) – за нарушения на СИК извън
        страната.
      </p>

      <p>
        Освен права, застъпниците/представители на коалиция имат и задължения –
        да спазват реда за свободното и спокойно протичане на гласуването в
        избирателната секция, да не пречат на гласуването в избирателната секция
        и да изпълняват указанията на председателя и решенията на секционната
        избирателна комисия.
      </p>

      <p>Какво могат да правят защитниците на вота в изборния ден?</p>

      <p>
        Защитниците на вота (или т.нар. „застъпници“ или “представители на
        коалиция/партия”) имат право да присъстват в изборното помещение и да
        следят процеса на преброяване на резултатите от гласуването и
        изготвянето на протокола на секционната избирателна комисия.
      </p>

      <p>
        Застъпникът или представителя на коалиция партия има право – и е
        задължително, и изключително важно – да получи, след приключване на
        изборния ден в съответната секция, копие от протокола с резултатите от
        гласуването, подписано от членовете на СИК. Копието се прави в
        съответната СИК като всяка от страниците му се подпечатва с печата на
        комисията и се подписва от председателя, заместник-председател и
        секретаря. При получаването на копието, застъпникът се вписва в списък
        на лицата, получили копие от протокола.
      </p>

      <p>
        Изборният ден се открива в 7:00 часа и приключва в 20:00 часа местно
        време.
      </p>

      <p>
        Защитниците на вота трябва да спазват противоепидемични мерки в изборния
        ден.
      </p>
    </MainContent>
  )
}
