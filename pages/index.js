import React, {useMemo, useState, useCallback} from 'react';
import camelCase from 'lodash/camelCase';
import { js } from 'js-beautify'
import Head from "next/head";

const GeneratorPage = () => {
  const [response, setResponse] = useState('');
  const [approvedList, setApprovedList] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const onClickGenerate = useCallback(() => {
    if (response) {
      const obj = JSON.parse(response);
      if (Array.isArray(obj)) {
        let approvedList;
        approvedList = obj.filter(o => o.DtlRequestProduct.is_approved);
        if (selectedOption) {
          approvedList = approvedList.filter(o => o.DtlRequestProduct.screen_name.trim() === selectedOption.trim())
        }
        setApprovedList(approvedList);
      }
    }

  }, [response, selectedOption])

  const str = useMemo(() => {
    return js(`import GTM from '@lib/utils/GTM';\n
    const pushTracker = (obj) => {
      GTM.pushObject({
        ...obj,
        businessUnit: '{businessUnit}',
        currentSite: '{currentSite}',
        userId: '{userId}',
      })
    };\n
    ${approvedList?.map(o => {
      const obj = ({
        ...JSON.parse(o.DtlRequestTracker.result),
        businessUnit: undefined,
        currentSite: undefined,
        userId: undefined
      });

      return `export const tracker_${camelCase(o.DtlRequestProduct.screen_name)}_${camelCase(o.DtlRequestProduct.user_action)} = () => { pushTracker(${JSON.stringify(obj)}); };\n\n`
    }).join('') || ''}
  `, {
      "indent_size": "2",
      "indent_char": " ",
      "max_preserve_newlines": "5",
      "preserve_newlines": true,
      "keep_array_indentation": false,
      "break_chained_methods": false,
      "indent_scripts": "normal",
      "brace_style": "collapse",
      "space_before_conditional": true,
      "unescape_strings": false,
      "jslint_happy": false,
      "end_with_newline": false,
      "wrap_line_length": "0",
      "indent_inner_html": false,
      "comma_first": false,
      "e4x": false,
      "indent_empty_lines": false
    }).trim()
  }, [approvedList])

  const selections = useMemo(() => {
    if (response) {
      const obj = JSON.parse(response);
      if (Array.isArray(obj)) {
        return ([...new Set(obj?.map(o => o.DtlRequestProduct.screen_name.trim())) || []]).sort()
      }
    }
    return []
  }, [response])

  return (
    <div>
      <Head>
        <title>Thanos Tracker File Generator</title>
        <meta name="description" content="Tracker File Generator. Crafted with ♥️ by @willypt" />
      </Head>

      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-gray-700 bg-blue-500 text-sm">
        <div className="w-full flex items-center justify-between h-14 text-white z-10 px-3 text-lg">
          <strong>Thanos Tracker File Generator</strong>
        </div>
        <div className="flex flex-col flex-1 p-3">
          <textarea value={response} className="rounded-lg p-4 h-60 shadow-xl focus-within:shadow-2xl outline-none" onChange={e => setResponse(e.target.value)} />
          <div className="flex mt-3 mb-3 flex-col md:flex-row ">
            <button className="mr-2 h-9 bg-green-300 rounded-lg p-2 shadow-md w-full font-extrabold text-gray-700 mb-2 md:m-0" onClick={onClickGenerate}>Generate File</button>
            <select value={selectedOption} className="w-full md:w-max md:ml-2 rounded-lg p-2" onChange={e => setSelectedOption(e.target.value)}>
              <option value="">-- All Pages --</option>
              {selections.map(v => <option key={v} value={v}>{v}</option>)}

            </select>
          </div>
          <textarea value={str} readOnly className="rounded-lg p-4 h-60 shadow-xl focus-within:shadow-2xl outline-none flex-1" />
        </div>
      </div>
    </div>
  )
}

export default GeneratorPage