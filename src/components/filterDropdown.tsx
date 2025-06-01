import { Checkbox } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import type { Key, ReactNode } from 'react'

type FilterOption = {
  text: string | ReactNode
  value: string
}

type FilterDropdownComponentProps = FilterDropdownProps & {
  options: FilterOption[]
}

export const FilterDropdown = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  options,
}: FilterDropdownComponentProps) => (
  <div className="p-2">
    {options.map((option: FilterOption) => (
      <div key={option.value} className="py-1">
        <Checkbox
          checked={selectedKeys.includes(option.value)}
          onChange={(e) => {
            const newKeys = e.target.checked
              ? [...selectedKeys, option.value]
              : selectedKeys.filter((key: Key) => key !== option.value)
            setSelectedKeys(newKeys)
            confirm({ closeDropdown: false })
          }}
        >
          {option.text}
        </Checkbox>
      </div>
    ))}
  </div>
)
